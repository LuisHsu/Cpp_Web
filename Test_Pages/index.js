var xhr = function() {
    if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    else {
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch(e) {
            throw new Error('XMLHttpRequest not supported');
        }
    }
};

function LoginFunc() {
	// JSON object
	var obj = {
    	UserName : document.getElementById("Account").value,
    	Password : document.getElementById("Password").value
	};
	var json=JSON.stringify(obj);
	
	// AJAX post request
	var req=xhr();
	req.onreadystatechange=function(){
  		if (req.readyState==4 && req.status==200){
  			var resp=req.responseText;
  			if(resp=="Login Failed"){
  				document.getElementById("Login Status").innerHTML="Login Failed";
  			}else{
  				document.getElementById("Login Status").innerHTML=resp;
  			}
    	}
  	}
	req.open("POST","/login",true);
	req.setRequestHeader("Content-type","application/json");
	req.send(json);
}