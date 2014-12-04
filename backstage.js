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
		console.log('Database Admin Connected');
	})
	.on('error',function(err){
		console.log('Database Admin Connect error');
		console.log(err);
	})
	.on('close',function(){
		console.log('Database Admin Connect Close');
	});
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
						req.session.id=ID;
						req.session.password=Password;
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
					req.session.login=true;
					res.send("Login!");
				}else{
					res.send("Wrong password!");
				}
			}
		}
	});
	
	// Change Password
	app.post('/ChangePassword',function(req,res){
		if(req.body.section=="1"){
			var ID=req.session.id;
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
				var ID=req.session.id;
				var error=0;
				if(("\""+plain_Rb+"\"")==JSON2.stringify(JSON2.decycle(req.body.Rb))){
					var newPW=JSON.parse(AES.decrypt(req.body.NewPW,req.session.password).toString(CryptoJS.enc.Utf8));
					AdmDB.query('UPDATE Cpp2015.Account_Table SET password= :newPW WHERE id= :id;',{newPW: newPW,id: ID})
						.on('result',function(res){
							res.on('error',function(err){
								console.log("Failed to update Password"+': Error- '+inspect(err));
								error=1;
							})
						})
						.on('end',function(){
							if(error==1){
								res.send("Failed!");
							}else{
								req.session.password=newPW;
								res.send("Changed!");
							}
						});
				}else{
					res.send("Wrong password!");
				}
			}
		}
	});
	
	// Query permission
	app.post('/queryperm',function(req,res){
		var view_perm='';
		var sess_perm='';
		DB.query("SELECT permission FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.body.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+inspect(err));
				})
			})
			.on('end',function(){
				DB.query("SELECT permission FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
				.on('result',function(res){
					res.on('row',function(row){
						sess_perm=row.permission;
					})
					.on('error',function(err){
						console.log(req.ip+': Error- '+inspect(err));
					})
				})
				.on('end',function(){
					if((sess_perm=="Owner")&&(view_perm!="Owner")){
						if(view_perm=="Admin"){
							res.send("<option>Admin</option><option>User</option>");
						}else{
							res.send("<option>User</option><option>Admin</option>");
						}
					}else{
						res.send("<option>"+view_perm+"</option>");
					}
				});
			});
	});
	
	// Edit Account
	app.post('/AccountEdit',function(req,res){
		var ID=req.session.id;
		var Password='';
		var Permission='';
		var found=0;
		DB.query('SELECT * FROM Cpp2015.Account_Table WHERE id= :id ;',{id: ID})
			.on('result',function(res){
				res.on('row',function(row){
					Password=row.password;
					Permission=row.permission;
					found=1;
				})
				.on('error',function(err){
					console.log("Failed to get Password"+': Error- '+inspect(err));
				})
			})
			.on('end',function(){
				if(found==1){
					if(Password==req.session.password){
						if((Permission=="Admin")||(Permission=="Owner")){
							// check repeat
							if(req.body.pw_new!=req.body.pw_conf){
								res.send("Repeat password didn't match new password!");
								return;
							}
							// Create SQL Query string
							var savstr='';
							if((req.body.id_new!='')&&(req.body.id_new!=req.body.id)){
								savstr+="id='"+req.body.id_new+"',";
							}
							if(req.body.pw_new!=''){
								savstr+="password='"+req.body.pw_new+"',";
							}
							if(Permission=="Owner"){
								savstr+="permission='"+req.body.perm+"',";
							}
							// Do SQL Update
							if(savstr!=''){
								savstr=savstr.substring(0,savstr.length-1);
								var error=0;
								AdmDB.query('UPDATE Cpp2015.Account_Table SET '+savstr+' WHERE id= :id;',{id: req.body.id})
									.on('result',function(res){
										res.on('error',function(err){
											console.log("Failed to edit Account"+': Error- '+inspect(err));
											error=1;
										})
									})
									.on('end',function(){
										if(error==1){
											res.send("Account edit Failed!");
										}else{
											res.send("Account edit Success!");
										}
									});
							}else{
								res.send("Account edit Success!");
							}
						}else{
							res.send("Only Admin or Owner can edit accounts!");
						}
					}else{
						res.send("Authentication Failed!");
					}
				}else{
					res.send("Authentication Failed!");
				}
			});
	});

	// Delete Account
	var perm_del='';
	var Pass_del='';
	app.post('/AccountDelete',function(req,res){
		if(req.body.section=="1"){
			var ID=req.session.id;
			var Ra1=req.body.key;
			var found=0;
			var error=0;
			DB.query('SELECT * FROM Cpp2015.Account_Table WHERE id= :id ;',{id: ID})
				.on('result',function(res){
					res.on('row',function(row){
						Pass_del=row.password;
						perm_del=row.permission;
						found=1;
					})
					.on('error',function(err){
						console.log("Failed to get Password"+': Error- '+inspect(err));
						error=1;
					})
				})
				.on('end',function(){
					if(error==1){
						res.send("Authentication Failed! Please re-login and try again!");
						return;
					}
					if(found==1){
						plain_Rb=makepassword();
						var Rb1=AES.encrypt(plain_Rb,Pass_del);
						res.send(JSON2.stringify(JSON2.decycle({Ra: Ra1,Rb: Rb1})));
					}else{
						res.send("Authentication Failed! Please re-login and try again!");
					}
				});
		}else{
			if(req.body.section=="2"){
				if(("\""+plain_Rb+"\"")==JSON2.stringify(JSON2.decycle(req.body.Rb))){
					if((perm_del=="Admin")||(perm_del=="Owner")){
						var delID=AES.decrypt(req.body.delID,Pass_del).toString(CryptoJS.enc.Utf8);
						var error=0;
						AdmDB.query('DELETE FROM Cpp2015.Account_Table WHERE id= :id;',{id: delID})
							.on('result',function(res){
								res.on('error',function(err){
									console.log("Failed to delete Account"+': Error- '+inspect(err));
									error=1;
								})
							})
							.on('end',function(){
								if(error==1){
									res.send("Account delete Failed!");
								}else{
									res.send("Account delete Success!");
								}
							});
					}else{
						res.send("Only Admin or Owner can delete accounts!");
					}
				}else{
					res.send("Wrong password!");
				}
			}
		}
	});
	
	// Bulletin
	app.get('/backstage_bulletin',function(req,res){
		if(req.session.login==true){
			res.render('pages/backstage_bulletin');
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Account Setting
	app.get('/backstage_account',function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT permission FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					exist=1;
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+inspect(err));
				})
			})
			.on('end',function(){
				// variables
				var ids=new Array();
				var perms=new Array();
				var i=0;
				// Get Data
				if(exist==1){
					DB.query("SELECT * FROM Cpp2015.Account_Table;")
						.on('result',function(res){
							res.on('row',function(row){
								ids[i]=row.id;
								perms[i]=row.permission;
								i+=1;
							})
							.on('error',function(err){
								console.log(req.ip+': Error- '+inspect(err));
							})
						})
						.on('end',function(){
							res.render('pages/backstage_account',{
								permission: view_perm,
								ids: ids,
								perms: perms,
								viewerid: req.session.id
							});
						});
				}else{
					res.redirect('/loginpage');
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Logout
	app.get('/backstage_logout',function(req,res){
		if(req.session.login==true){
			req.session.login=false;
		}
		res.redirect('/loginpage');
	});
	
	// Create Account
	var perm_cre='';
	var Pass_cre='';
	app.post('/AccountCreate',function(req,res){
		if(req.body.section=="1"){
			var ID=req.session.id;
			var Ra1=req.body.key;
			var found=0;
			var error=0;
			DB.query('SELECT * FROM Cpp2015.Account_Table WHERE id= :id ;',{id: ID})
				.on('result',function(res){
					res.on('row',function(row){
						Pass_cre=row.password;
						perm_cre=row.permission;
						found=1;
					})
					.on('error',function(err){
						console.log("Failed to get Password"+': Error- '+inspect(err));
						error=1;
					})
				})
				.on('end',function(){
					if(error==1){
						res.send("Authentication Failed! Please re-login and try again!");
						return;
					}
					if(found==1){
						plain_Rb=makepassword();
						var Rb1=AES.encrypt(plain_Rb,Pass_cre);
						res.send(JSON2.stringify(JSON2.decycle({Ra: Ra1,Rb: Rb1})));
					}else{
						res.send("Authentication Failed! Please re-login and try again!");
					}
				});
		}else{
			if(req.body.section=="2"){
				if(("\""+plain_Rb+"\"")==JSON2.stringify(JSON2.decycle(req.body.Rb))){
					if((perm_cre=="Admin")||(perm_cre=="Owner")){
						var creID=AES.decrypt(req.body.creID,Pass_cre).toString(CryptoJS.enc.Utf8);
						var crePW=AES.decrypt(req.body.crePW,Pass_cre).toString(CryptoJS.enc.Utf8);
						var creConf=AES.decrypt(req.body.creConf,Pass_cre).toString(CryptoJS.enc.Utf8);
						if((creID=='')||(crePW=='')||(creConf=='')){
							res.send("ID and Password can't be empty!");
							return;
						}
						// check repeat
						if(crePW!=creConf){
							res.send("Repeat password didn't match new password!");
							return;
						}
						var error=0;
						var found=0;
						DB.query('SELECT * FROM Cpp2015.Account_Table WHERE id= :id ;',{id: creID})
							.on('result',function(res){
								res.on('row',function(row){
									found=1;
								})
								.on('error',function(err){
									console.log("Failed to get Password"+': Error- '+inspect(err));
									error=1;
								})
							})
							.on('end',function(){
								if(error==1){
									res.send("Database Query Error!");
									return;
								}
								if(found==1){
									res.send("Account already exist!");
								}else{
									AdmDB.query("INSERT INTO Cpp2015.Account_Table (id, password, permission) VALUES ( :id , :pw , 'User');"
									,{id: creID , pw: crePW })
										.on('result',function(res){
											res.on('error',function(err){
												console.log("Failed to create Account"+': Error- '+inspect(err));
												error=1;
											})
										})
										.on('end',function(){
											if(error==1){
												res.send("Account create Failed!");
											}else{
												res.send("Account create Success!");
											}
										});
								}
							});
					}else{
						res.send("Only Admin or Owner can delete accounts!");
					}
				}else{
					res.send("Wrong password!");
				}
			}
		}
	});
	
}
