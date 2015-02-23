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

function edit_bulletin(){
	var req=PostReq();
		req.onreadystatechange=function(){
			if(req.readyState==4 && req.status == 200){
				if(req.responseText=="Error!"){
					alert("Error");
				}else{
					location.reload();
				}
			}
		}
		req.open("POST","bulletin_edit",true);
		req.setRequestHeader("Content-type","application/json");
		var obj={
			content: CKEDITOR.instances.Edit_Area.getData()
		}
		req.send(JSON.stringify(obj));
}

function edit_about(){
	var req=PostReq();
		req.onreadystatechange=function(){
			if(req.readyState==4 && req.status == 200){
				if(req.responseText=="Error!"){
					alert("Error");
				}else{
					alert("About Save Success!");
				}
			}
		}
		req.open("POST","about_edit",true);
		req.setRequestHeader("Content-type","application/json");
		var obj={
			content: CKEDITOR.instances.Edit_About.getData()
		}
		req.send(JSON.stringify(obj));
}

function edit_contact(){
	var req=PostReq();
		req.onreadystatechange=function(){
			if(req.readyState==4 && req.status == 200){
				if(req.responseText=="Error!"){
					alert("Error");
				}else{
					alert("Contact Save Success!");
				}
			}
		}
		req.open("POST","contact_edit",true);
		req.setRequestHeader("Content-type","application/json");
		var obj={
			content: CKEDITOR.instances.Edit_Contact.getData()
		}
		req.send(JSON.stringify(obj));
}
