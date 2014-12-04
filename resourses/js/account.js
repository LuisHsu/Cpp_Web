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

// Edit button click
function edclick(e){
	var perm='';
	// query permission
	var qryreq=PostReq();
	qryreq.onreadystatechange=function(){
		if(qryreq.readyState==4){
			// Show dialog
			document.getElementById("edit_perm").innerHTML=qryreq.responseText;
			document.getElementById("edit_id").value=e.getAttribute("acc");
			document.getElementById("editdialog").setAttribute("acc",e.getAttribute("acc"));
			document.getElementById("editdialog").style.display="inline";
		}
	}
	qryreq.open("POST","queryperm",true);
	qryreq.setRequestHeader("Content-type","application/json");
	var obj={
		id: e.getAttribute("acc")
	}
	qryreq.send(JSON.stringify(obj));
}
// Edit_cancel button click
function ed_cancel(){
	document.getElementById("editdialog").style.display="none";
}

// Edit_save button click
function ed_save(){
	var savreq=PostReq();
	savreq.onreadystatechange=function(){
		if(savreq.readyState==4){
			alert(savreq.responseText);
			if(savreq.responseText=="Authentication Failed!"){
				window.location = "/loginpage";
			}else{
				document.getElementById("editdialog").style.display="none";
				window.location = "/backstage_account";
			}
		}
	}
	savreq.open("POST","AccountEdit",true);
	savreq.setRequestHeader("Content-type","application/json");
	var obj={
		id: document.getElementById("editdialog").getAttribute("acc"),
		id_new: document.getElementById("edit_id").value,
		pw_new: document.getElementById("edit_pw").value,
		pw_conf: document.getElementById("edit_conf").value,
		perm: document.getElementById("edit_perm").value
	}
	savreq.send(JSON.stringify(obj));
} 
