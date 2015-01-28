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

//Create Dialog
function cre_click(){
	// Show dialog
	document.getElementById("createdialog").style.display="inline";
}

//Create Cancel
function cre_cancel(){
	// Show dialog
	document.getElementById("createdialog").style.display="none";
}

// Create Action
function cre_create(){
	var obj;
	// request 1
	var req_1=PostReq();
	var creWork=document.getElementById("cre_work").value;
	var creAuthor=document.getElementById("cre_author").value;
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			alert(req_1.responseText);
			location.reload();
		}
	}
	
	req_1.open("POST","project_create",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		work: creWork,
		author: creAuthor
	}
	req_1.send(JSON.stringify(obj));
}


// Delete dialog
function del_click(e){
	// Show dialog
	document.getElementById("deletedialog").setAttribute("ind",e.getAttribute("ind"));
	document.getElementById("del_conf").value="";
	document.getElementById("del_ind").innerHTML=e.getAttribute("ind");
	document.getElementById("deletedialog").style.display="inline";
}

// Delete_cancel button click
function del_cancel(){
	document.getElementById("deletedialog").style.display="none";
}

// Create Action
function del_delete(){
	var obj;
	// request 1
	var req_1=PostReq();
	var delInd=document.getElementById("deletedialog").getAttribute("ind");
	var delPW=document.getElementById("del_conf").value;
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			alert(req_1.responseText);
			location.reload();
		}
	}
	
	req_1.open("POST","project_delete",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		password: delPW,
		index: delInd
	}
	req_1.send(JSON.stringify(obj));
}

// Edit Action
function edit_click(e){
	location.href="project_edit_page";
}
