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
    	Account : document.getElementById("Account").value,
    	PassWord : document.getElementById("Password").value
	};
	var json=JSON.stringify(obj);
	
	// AJAX post request
	var req=xhr();
	req.onreadystatechange=function(){
  		if (req.readyState==4 && req.status==200){
  			document.getElementById("LoginForm").innerHTML=req.responseText;
    	}
  	}
	req.open("POST","/login",true);
	req.setRequestHeader("Content-type","application/json");
	req.send(json);
}
