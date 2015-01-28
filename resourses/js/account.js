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

// Delete button click
function delclick(e){
	// Show dialog
	document.getElementById("deldialog").setAttribute("acc",e.getAttribute("acc"));
	document.getElementById("del_conf").value="";
	document.getElementById("del_id").innerHTML=e.getAttribute("acc");
	document.getElementById("deldialog").style.display="inline";
}

// Delete_cancel button click
function del_cancel(){
	document.getElementById("deldialog").style.display="none";
}

// Delete_Delete button click
function del_de(){
	var obj;
	// request 1
	var req_1=PostReq();
	var Ra=makepassword();
	var delID=document.getElementById("deldialog").getAttribute("acc");
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			if(req_1.responseText=="Authentication Failed! Please re-login and try again!"){
				alert("Authentication Failed! Please re-login and try again!");
			}else{
				var resp_obj=JSON.parse(req_1.responseText);
				if(resp_obj.Ra==Ra){
					var Rb=CryptoJS.AES.decrypt(resp_obj.Rb,document.getElementById("del_conf").value);
					var req_2=PostReq();
					req_2.onreadystatechange=function(){
						if(req_2.readyState==4){
							alert(req_2.responseText);
							location.reload();
						}
					}
					req_2.open("POST","AccountDelete",true);
					req_2.setRequestHeader("Content-type","application/json");
					obj={
						section: "2",
						Rb: Rb.toString(CryptoJS.enc.Utf8),
						delID: CryptoJS.AES.encrypt(delID,document.getElementById("del_conf").value)
					};
					req_2.send(JSON.stringify(JSON.decycle(obj)));
				}else{
					alert("Authentication Failed! Please re-login and try again!");
				}				
			}
		}
	}
	
	req_1.open("POST","AccountDelete",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		section: "1",
		key: Ra
	}
	req_1.send(JSON.stringify(obj));
} 

// Create button click
function creclick(){
	// Show dialog
	document.getElementById("credialog").style.display="inline";
}

// Create_cancel button click
function cre_cancel(){
	document.getElementById("credialog").style.display="none";
}

// Create_Create button click
function cre_create(){
	var obj;
	// request 1
	var req_1=PostReq();
	var Ra=makepassword();
	var creID=document.getElementById("cre_id").value;
	var crePW=document.getElementById("cre_pw").value;
	var creConf=document.getElementById("cre_conf").value;
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			if(req_1.responseText=="Authentication Failed! Please re-login and try again!"){
				alert("Authentication Failed! Please re-login and try again!");
			}else{
				var resp_obj=JSON.parse(req_1.responseText);
				if(resp_obj.Ra==Ra){
					var Rb=CryptoJS.AES.decrypt(resp_obj.Rb,document.getElementById("cre_your").value);
					var req_2=PostReq();
					req_2.onreadystatechange=function(){
						if(req_2.readyState==4){
							alert(req_2.responseText);
							location.reload();
						}
					}
					req_2.open("POST","AccountCreate",true);
					req_2.setRequestHeader("Content-type","application/json");
					obj={
						section: "2",
						Rb: Rb.toString(CryptoJS.enc.Utf8),
						creID: CryptoJS.AES.encrypt(creID,document.getElementById("cre_your").value),
						crePW: CryptoJS.AES.encrypt(crePW,document.getElementById("cre_your").value),
						creConf: CryptoJS.AES.encrypt(creConf,document.getElementById("cre_your").value)
					};
					req_2.send(JSON.stringify(JSON.decycle(obj)));
				}else{
					alert("Authentication Failed! Please re-login and try again!");
				}				
			}
		}
	}
	
	req_1.open("POST","AccountCreate",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		section: "1",
		key: Ra
	}
	req_1.send(JSON.stringify(obj));
}
