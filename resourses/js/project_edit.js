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
		formData.append("upload",file);
		formData.append("index",document.getElementById("ProjectIndex").innerHTML);
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				alert(req.statusText);
			}
		}
		req.open("post", "/preview_cover", true);
		req.send(formData);
	}
}

function edit_save(){
	alert(CKEDITOR.instances.Description.getData());
}
