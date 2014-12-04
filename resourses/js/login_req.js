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

var ID='';
var Password='';

// Login
function login(){
	var obj;
	// request 1
	var req_1=PostReq();
	ID=document.getElementById("ID").value;
	Password=document.getElementById("Password").value;
	var Ra=makepassword();
	
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			if(req_1.responseText=="Account isn't exist!"){
				document.getElementById("Status").innerHTML="Account isn't exist!";
			}else{
				var resp_obj=JSON.parse(req_1.responseText);
				if(resp_obj.Ra==Ra){
					var Rb=CryptoJS.AES.decrypt(resp_obj.Rb,Password);
					var req_2=PostReq();
					req_2.onreadystatechange=function(){
						if(req_2.readyState==4){
							if(req_2.responseText=="Login!"){
								window.location.href ='backstage_bulletin';
							}else{
								document.getElementById("Status").innerHTML="Wrong password!";
							}						
						}
					}
					req_2.open("POST","login",true);
					req_2.setRequestHeader("Content-type","application/json");
					obj={
						section: "2",
						Rb: Rb.toString(CryptoJS.enc.Utf8)
					};
					req_2.send(JSON.stringify(obj));
				}else{
					document.getElementById("Status").innerHTML="Authentication Failed";
				}				
			}
		}
	}
	
	req_1.open("POST","login",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		section: "1",
		data: ID,
		key: Ra
	}
	req_1.send(JSON.stringify(obj));
}

// Change Password
function ChangePassword(){
	var obj;
	var NewPass=document.getElementById("new_pw").value;
	Password=document.getElementById("old_pw").value;
	
	if(NewPass!=document.getElementById("conf_pw").value){
		alert("Repeat password isn't equal to New Password");
		return;
	}else{
		if(NewPass==""){
			alert("Please input New Password");
			return;
		}
	}
	
	// request 1
	var req_1=PostReq();
	var Ra=makepassword();
	
	req_1.onreadystatechange=function(){
		if(req_1.readyState==4){
			if(req_1.responseText=="Account isn't exist!"){
				alert("Authentication failed! Please login again.");
			}else{
				var resp_obj=JSON.parse(req_1.responseText);
				if(resp_obj.Ra==Ra){
					var Rb=CryptoJS.AES.decrypt(resp_obj.Rb,Password);
					var req_2=PostReq();
					req_2.onreadystatechange=function(){
						if(req_2.readyState==4){
							if(req_2.responseText=="Changed!"){
								alert("Password Changed!");
								window.location = "/loginpage";
							}else{
								if(req_2.responseText=="Wrong password!"){
									alert("Old password wrong!");
								}else{
									alert("Password change Failed!");	
								}
							}			
						}
					}
					req_2.open("POST","ChangePassword",true);
					req_2.setRequestHeader("Content-type","application/json");
					var obj1={
						section: "2",
						Rb: Rb.toString(CryptoJS.enc.Utf8),
						NewPW: CryptoJS.AES.encrypt(NewPass,Password)
					};
					req_2.send(JSON.stringify(JSON.decycle(obj1)));
				}else{
					alert("Authentication failed! Please login again.");
				}				
			}
		}
	}
	
	req_1.open("POST","ChangePassword",true);
	req_1.setRequestHeader("Content-type","application/json");
	obj={
		section: "1",
		key: Ra,
	}
	req_1.send(JSON.stringify(obj));
}
