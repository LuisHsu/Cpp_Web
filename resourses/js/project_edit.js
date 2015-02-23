// AJAX Object
var PostReq = window.XMLHttpRequest &&
(window.location.protocol !== 'file:' || !window.ActiveXObject) ?
function() {
    return new XMLHttpRequest();
} :
function() {
	try {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}catch(e){
    	throw new Error('XMLHttpRequest not supported');
    }
};

// Add remove func
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

// MakePassword
function makepassword(){
    var rets = "";    
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var i = 0;
    var pos;
    while (i<16){        
        pos = Math.random() * s.length;
        rets = rets + s.substring(pos,pos+1);        
        i = i + 1;
    }    
    return rets;
}

function chg_author_click(){
	document.getElementById("chgtitle").innerHTML="Change Author";
	document.getElementById("chg_change").setAttribute("onclick","chg_author()");;
	document.getElementById("changedialog").style.display="inline";
}

function chg_work_click(){
	document.getElementById("chgtitle").innerHTML="Change Work";
	document.getElementById("chg_change").setAttribute("onclick","chg_work()");;
	document.getElementById("changedialog").style.display="inline";
}

function chg_author(){
	document.getElementById("Author").innerHTML=document.getElementById("Change_text").value;
	document.getElementById("changedialog").style.display="none";
}

function chg_work(){
	document.getElementById("Work").innerHTML=document.getElementById("Change_text").value;
	document.getElementById("changedialog").style.display="none";
}

function change_cancel(){
	document.getElementById("changedialog").style.display="none";
}

function cover_change(){
	if(document.getElementById("uploadcover").value!=null){
		var req=PostReq();
		var file=document.getElementById("uploadcover").files[0];
		var formData = new FormData();
		var ind=document.getElementById("ProjectIndex").innerHTML;
		document.getElementById("preview_cover_status").style.display="inline";
		formData.append("upload",file);
		formData.append("index",ind);
		req.upload.addEventListener("progress", function(e) {
			var pc = parseInt(e.loaded / e.total * 100);
			document.getElementById("preview_cover_status").value=pc;
		}, false);
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				document.getElementById("preview_cover_status").style.display="none";
				if(req.responseText=="Error"){
					alert("Error!");
				}else{
					document.getElementById("coverview").src="projects/"+ind+"/cover_preview?r="+makepassword();
					document.getElementById("preview_cover_status").innerHTML="";
				}
			}
		}
		req.open("post", "/preview_cover", true);
		req.send(formData);
	}
}

function snap_upload_recur(fc2,len){
	var fc=fc2;
	var req=PostReq();
	var file=document.getElementById("uploadsnap").files[fc];
	var formData = new FormData();
	var ind=document.getElementById("ProjectIndex").innerHTML;
	formData.append("upload",file);
	formData.append("index",ind);
	document.getElementById("snap_upload_status").style.display="inline";
	document.getElementById("snap_upload_fcount").innerHTML="Uploading file("+(fc+1)+"/"+len+")";
	req.upload.addEventListener("progress", function(e) {
		var pc = parseInt(e.loaded / e.total * 100);
		document.getElementById("snap_upload_status").value=pc;
	}, false);
	req.onreadystatechange = function(){
		if (req.readyState == 4 && req.status == 200){
			document.getElementById("snap_upload_status").style.display="none";
			if(req.responseText=="Error"){
				alert("Error!");
			}else{
				document.getElementById("snap_list").innerHTML=document.getElementById("snap_list").innerHTML+"<a id=\""+req.responseText+"\" class=\"snap_name\" pic= \""+req.responseText+"\" onclick=\"snap_delete(this)\">"+req.responseText+" &nbsp<button class=\"snap_del\">x</button></a>&nbsp&nbsp";
				if(fc<(len-1)){
					snap_upload_recur(fc+1,len);
				}else{
					if(fc==(len-1)){
						alert("Upload finished!");
						document.getElementById("snap_upload_fcount").innerHTML="";
						document.getElementById("snap_upload_button").innerHTML=document.getElementById("snap_upload_button").innerHTML;
					}
				}
			}
		}
	}
	req.open("post", "/snap_upload", true);
	req.send(formData);
};

function snap_upload(){
	if(document.getElementById("uploadsnap").value!=null){
		snap_upload_recur(0,document.getElementById("uploadsnap").files.length);
	}
}

function snap_delete(e){
	var snap=e.getAttribute("pic");
	var conf=confirm("Sure to delete "+snap);
	if(conf==true){
		var req=PostReq();
		req.onreadystatechange=function(){
			if(req.readyState==4 && req.status == 200){
				if(req.responseText=="Error!"){
					alert(req.responseText);
				}else{
					document.getElementById(snap).remove();
				}
			}
		}
		req.open("POST","snap_delete",true);
		req.setRequestHeader("Content-type","application/json");
		var obj={
			index: document.getElementById("ProjectIndex").innerHTML,
			snapshot: snap
		}
		req.send(JSON.stringify(obj));
	}
}

function Link_reset(type){
	document.getElementById("reset_"+type).innerHTML=document.getElementById("reset_"+type).innerHTML;
}

function edit_save(){
	document.getElementById("savedialog").style.display="inline";
	var Index=document.getElementById("ProjectIndex").innerHTML;
	var Title=document.getElementById("Title").value;
	var Subtitle=document.getElementById("Subtitle").value;
	var Author=document.getElementById("Author").innerHTML;
	var Work=document.getElementById("Work").innerHTML;
	var Description=CKEDITOR.instances.Description.getData();
	var Win="",Linux="",Mac="";
	var Win_Finish=0;
	var Linux_Finish=0;
	var Mac_Finish=0;
	var Data_Finish=0;
	if(document.getElementById("uploadwin").value!=""){
		Win="File_Win_"+document.getElementById("uploadwin").value;
		var req=PostReq();
		var file=document.getElementById("uploadwin").files[0];
		var formData = new FormData();
		var ind=document.getElementById("ProjectIndex").innerHTML;
		formData.append("upload",file);
		formData.append("index",document.getElementById("ProjectIndex").innerHTML);
		formData.append("type","win");
		req.upload.addEventListener("progress", function(e) {
			var pc = parseInt(e.loaded / e.total * 100);
			document.getElementById("Save_Win_Bar").value=pc;
		}, false);
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				Win_Finish=1;
				if(req.responseText=="Error"){
					alert("Windows file upload Error!");
				}else{
					document.getElementById("Save_Win_Status").innerHTML="Finished!";
					document.getElementById("Save_Win_Status").style="color:green;";
				}
			}
		}
		req.open("post", "/Project_file_upload", true);
		req.send(formData);
	}else{
		if(document.getElementById("CurWin").innerHTML!="null"){
			Win=document.getElementById("CurWin").innerHTML;
		}
		Win_Finish=1;
		document.getElementById("Save_Win_Status").innerHTML="No change!";
		document.getElementById("Save_Win_Status").style="color:green;";
	}
	
	
	if(document.getElementById("uploadlinux").value!=""){
		Linux="File_Linux_"+document.getElementById("uploadlinux").value;
		var req=PostReq();
		var file=document.getElementById("uploadlinux").files[0];
		var formData = new FormData();
		var ind=document.getElementById("ProjectIndex").innerHTML;
		formData.append("upload",file);
		formData.append("index",document.getElementById("ProjectIndex").innerHTML);
		formData.append("type","linux");
		req.upload.addEventListener("progress", function(e) {
			var pc = parseInt(e.loaded / e.total * 100);
			document.getElementById("Save_Linux_Bar").value=pc;
		}, false);
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				Linux_Finish=1;
				if(req.responseText=="Error"){
					alert("Linux file upload Error!");
				}else{
					document.getElementById("Save_Linux_Status").innerHTML="Finished!";
					document.getElementById("Save_Linux_Status").style="color:green;";
				}
			}
		}
		req.open("post", "/Project_file_upload", true);
		req.send(formData);
	}else{
		if(document.getElementById("CurLinux").innerHTML!="null"){
			Linux=document.getElementById("CurLinux").innerHTML;
		}
		Linux_Finish=1;
		document.getElementById("Save_Linux_Status").innerHTML="No change!";
		document.getElementById("Save_Linux_Status").style="color:green;";
	}
	
	if(document.getElementById("uploadmac").value!=""){
		Mac="File_Mac_"+document.getElementById("uploadmac").value;
		var req=PostReq();
		var file=document.getElementById("uploadmac").files[0];
		var formData = new FormData();
		var ind=document.getElementById("ProjectIndex").innerHTML;
		formData.append("upload",file);
		formData.append("index",document.getElementById("ProjectIndex").innerHTML);
		formData.append("type","mac");
		req.upload.addEventListener("progress", function(e) {
			var pc = parseInt(e.loaded / e.total * 100);
			document.getElementById("Save_Mac_Bar").value=pc;
		}, false);
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				Mac_Finish=1;
				if(req.responseText=="Error"){
					alert("Linux file upload Error!");
				}else{
					document.getElementById("Save_Mac_Status").innerHTML="Finished!";
					document.getElementById("Save_Mac_Status").style="color:green;";
				}
			}
		}
		req.open("post", "/Project_file_upload", true);
		req.send(formData);
	}else{
		if(document.getElementById("CurMac").innerHTML!="null"){
			Mac=document.getElementById("CurMac").innerHTML;
		}
		Mac_Finish=1;
		document.getElementById("Save_Mac_Status").innerHTML="No change!";
		document.getElementById("Save_Mac_Status").style="color:green;";
	}
	
	var req=PostReq();
	req.onreadystatechange=function(){
		if(req.readyState==4 && req.status == 200){
			Data_Finish=1;
			if(req.responseText=="OK"){
				document.getElementById("Save_Data_Status").innerHTML="Finished!";
				document.getElementById("Save_Data_Status").style="color:green;";
			}else{
				alert("Database Update Error!");
			}
		}
	}
	req.open("POST","Project_edit_edit",true);
	req.setRequestHeader("Content-type","application/json");
	var obj={
		Title: Title,
		Subtitle: Subtitle,
		Author: Author,
		Work: Work,
		Description: Description,
		Win: Win,
		Linux:Linux,
		Mac: Mac,
		Index: Index
	}
	req.send(JSON.stringify(obj));
	var visor=setInterval(function(){
		if((Win_Finish==1)&&(Linux_Finish==1)&&(Mac_Finish==1)&&(Data_Finish==1)){
			clearInterval(visor);
			location.href="project_list";
		}
	},1000);
}
