var JSON2=require('JSON2');
var maria=require('mariasql');
var CryptoJS=require('crypto-js');
var AdmDB=new maria();
AdmDB.connect({
		host: "140.116.246.195",
		user: "admin",
		password: "BD0gdJZpVxLdQaGf",
		db: "Cpp2015"
	});
AdmDB.on('connect',function(){
		console.log('Database Project Admin Connected');
	})
	.on('error',function(err){
		console.log('Database Project Admin Connect error');
		console.log(err);
	})
	.on('close',function(){
		console.log('Database Project Admin Connect Close');
	});
	
module.exports=function(app,DB,AES){
	// Project  Page
	app.get('/project_list',function(req,res){
		res.render('pages/project_list');
	});
}
