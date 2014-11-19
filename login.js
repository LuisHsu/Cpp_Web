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

var JSON2=require('JSON2');
var plain_Rb;

module.exports=function(app,DB,Category,AES){
	// Login Page
	app.get('/loginpage',function(req,res){
		res.render('pages/login',{
			categories:Category,
			status:""
		});
	});
	
	// Login request
	app.post('/login',function(req,res){
		if(req.body.section=="1"){
			var ID=req.body.data;
			var Ra1=req.body.key;
			var Password='';
			var found=0;
			DB.query('SELECT password FROM Cpp2015.Account_Table WHERE id= :id ;',{id: ID})
				.on('result',function(res){
					res.on('row',function(row){
						Password=row.password;
						found=1;
					})
					.on('error',function(err){
						console.log("Failed to get Password"+': Error- '+inspect(err));
					})
				})
				.on('end',function(){
					if(found==1){
						plain_Rb=makepassword();
						var Rb1=AES.encrypt(plain_Rb,Password);
						res.send(JSON2.stringify(JSON2.decycle({Ra: Ra1,Rb: Rb1})));
					}else{
						res.send("Account isn't exist!");
					}
				});
		}else{
			if(req.body.section=="2"){
				if(("\""+plain_Rb+"\"")==JSON2.stringify(JSON2.decycle(req.body.Rb))){
//					
				}else{
//					
				}
			}
		}
	});
	
	// Backstage
	app.get('/backstage',function(req,res){
		
	});
}
