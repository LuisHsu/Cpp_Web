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

// Login
function login(){
	var obj;
	// request 1
	var req_1=PostReq();
	var ID=document.getElementById("ID").value;
	var Password=document.getElementById("Password").value;
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
//							
						}
					}
					req_2.open("POST","login",true);
					req_2.setRequestHeader("Content-type","application/json");
					obj1={
						section: "2",
						Rb: Rb.toString(CryptoJS.enc.Utf8)
					};
					req_2.send(JSON.stringify(obj1));
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
