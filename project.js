var JSON2=require('JSON2');
var maria=require('mariasql');
var CryptoJS=require('crypto-js');
var fs = require('fs');
	
module.exports=function(app,DB,AES,Category,multipartMiddleware,AdmDB){
	// Project  Page
	app.get('/project_list',function(req,res){
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
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// variables
				var indices=new Array();
				var titles=new Array();
				var works=new Array();
				var authors=new Array();
				var updates=new Array();
				var i=0;
				// Get Data
				if(exist==1){
					DB.query("SELECT * FROM Cpp2015.Project_Table;")
						.on('result',function(res){
							res.on('row',function(row){
								var SplitAuthor=row.author.split(",");
								var shown=0;
								for(var j=0;j<SplitAuthor.length;++j){
									if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
										shown=1;
										break;
									}
								}
								if(shown==1){
									indices[i]=row.project_index;
									titles[i]=row.title;
									works[i]=row.category;
									authors[i]=row.author;
									updates[i]=row.upload_time;
									i+=1;
								}
							})
							.on('error',function(err){
								console.log(req.ip+': Error- '+err);
							})
						})
						.on('end',function(){
							res.render('pages/project_list',{
								permission: view_perm,
								indices: indices,
								titles: titles,
								works: works,
								authors: authors,
								updates: updates
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
	
	// Project Create
	app.post('/project_create',function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					var succ=0;
					AdmDB.query("INSERT INTO Cpp2015.Project_Table (category, author) VALUES ( :work , :author);"
					,{work: req.body.work , author: req.body.author })
						.on('result',function(res){
							res.on('error',function(err){
								console.log(req.ip+': Error- '+err);
								succ=1;
							})
						})
						.on('end',function(){
							if(succ==0){
								var c=0,s=0;
								DB.query('SELECT DISTINCT category FROM Cpp2015.Project_Table;')
								.on('result',function(res){
									res.on('row',function(row){
										Category[c]=row.category;
										c+=1;
									})
									.on('error',function(err){
										console.log("Failed to get category"+': Error- '+err);
										s=1;
									})
								})
								.on('end',function(){
									if(s==0){
										console.log('Category Updating success!');
									}
								});
								res.send("Project create Success!");
							}else{
								res.send("Project create Failed!");
							}
						});
				}else{
					res.redirect('/loginpage');
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project Delete
	app.post('/project_delete',function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						if(row.password==req.body.password){
							exist=1;
						}else{
							exist=-1;	
						}
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.body.index;
					var Title;
					var Subtitle;
					var Author;
					var Work;
					var Update_time;
					var Star;
					var Popularity;
					var Download_times;
					var Pic_count;
					var Description;
					var Win_path;
					var Mac_path;
					var Linux_path;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							Title=row.title;
							Subtitle=row.subtitle;
							Author=row.author;
							Work=row.category;
							Update_time=row.upload_time;
							Star=row.star;
							Popularity=row.popularity;
							Download_times=row.download_times;
							Pic_count=row.pic_count;
							Description=row.description;
							Win_path=row.win_path;
							Mac_path=row.mac_path;
							Linux_path=row.linux_path;
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						var data="Project_Index: "+Project_Index+"\nTitle: "+Title+"\nSubtitle: "+Subtitle+"\nAuthor: "+Author+"\nWork: "+Work+"\nUpdate_time: "+Update_time+"\nStar: "+Star+"\nPopularity: "+Popularity+"\nDownload_times: "+Download_times+"\nPic_count: "+Pic_count+"\nWin_path: "+Win_path+"\nLinux_path: "+Linux_path+"\nMac_path: "+Mac_path+"\nDescription:\n"+Description;
						fs.appendFile('projects/'+Project_Index+'_Delete_backup.txt',"",function(aerr){
							if(aerr){
								console.log(req.ip+': Error- '+aerr);
								res.send("Project Delete Error!");
							}else{
								fs.writeFile('projects/'+Project_Index+'_Delete_backup.txt',data,function(err){
									if(err){
										console.log(req.ip+': Error- '+err);
										res.send("Project Delete Error!");
									}else{
										var succ=0;
										AdmDB.query("DELETE FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
											.on('result',function(res){
												res.on('error',function(err){
													console.log(req.ip+': Error- '+err);
													succ=1;
												})
											})
											.on('end',function(){
												if(succ==0){
													res.send("Project "+Project_Index+" is deleted!\n\n*** NOTICE ***\nThough the record is removed from database,\nthe files are't removed. \nIf you want to remove the files, \nplease ask for administrators(TA or Teacher).");
												}else{
													res.send("Project Delete Failed!");
												}
											});
									}
								});
							}
						});
					});
				}else{
					if(exist==-1){
						res.send("Password Not match! Please delete again!");
					}else{
						res.redirect('/loginpage');
					}
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project Edit Page
	app.get('/project_edit_page',function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.query.index;
					var Title;
					var Subtitle;
					var Author;
					var Work;
					var Snaps=new Array();
					var Description;
					var Win_path;
					var Mac_path;
					var Linux_path;
					var verify=0;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									Title=row.title;
									Subtitle=row.subtitle;
									Author=row.author;
									Work=row.category;
									Description=row.description;
									Win_path=row.win_path;
									Mac_path=row.mac_path;
									Linux_path=row.linux_path;
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var dirlist=fs.readdirSync('projects/'+Project_Index);
							var piccont=0;
							for(var i=0;i<dirlist.length;++i){
								if(dirlist[i].indexOf("snap_")==0){
									Snaps[piccont]=dirlist[i];
									piccont+=1;
								}
							}
							res.render('pages/project_edit',{
								index: Project_Index,
								title: Title,
								subtitle: Subtitle,
								author: Author,
								work: Work,
								permission: view_perm,
								Snapshots: Snaps,
								Win_path: Win_path,
								Linux_path: Linux_path,
								Mac_path: Mac_path,
								Description: Description
							});
						}else{
							res.redirect('/loginpage');
						}
					});
				}else{
					res.redirect('/loginpage');
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project Cover Preview
	app.post('/preview_cover',multipartMiddleware,function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.body.index;
					var verify=0;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var fs = require('fs');
							var tmpPath = req.files.upload.path;
							var dest = __dirname+"/projects/"+req.body.index+"/cover_preview";
							fs.readFile(tmpPath, function(err, data) {
								if (err) {
									console.log(err);
									res.send("Error");
									return;
								}
								fs.writeFile(dest, data, function(err) {
									if (err) {
								  		console.log(err);
								  		res.send("Error");
								  		return;
									}
									fs.unlink(tmpPath,function(err){
										if (err) {
									  		console.log(err);
									  		res.send("Error");
									  		return;
										}
										res.send("OK");
									});
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
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project Snap Upload
	app.post('/snap_upload',multipartMiddleware,function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.body.index;
					var verify=0;
					var Pic_count;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									Pic_count=row.pic_count;
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var fs = require('fs');
							var tmpPath = req.files.upload.path;
							var dest = __dirname+"/projects/"+req.body.index+"/snap_"+Pic_count;
							fs.readFile(tmpPath, function(err, data) {
								if (err) {
									console.log(err);
									res.send("Error");
									return;
								}
								fs.writeFile(dest, data, function(err) {
									if (err) {
								  		console.log(err);
								  		res.send("Error");
								  		return;
									}
									var pic1=parseInt(Pic_count)+1;
									AdmDB.query('UPDATE Cpp2015.Project_Table SET pic_count= :newCount WHERE project_index= :index;',{index: Project_Index,newCount: pic1})
									.on('result',function(res){
										res.on('error',function(err){
											console.log(req.ip+': Error- '+err);
										})
									})
									fs.unlink(tmpPath,function(err){
										if (err) {
									  		console.log(err);
									  		res.send("Error");
									  		return;
										}
										res.send("snap_"+Pic_count);
									});
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
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project Snap Delete
	app.post('/snap_delete',multipartMiddleware,function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.body.index;
					var verify=0;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var fs = require('fs');
							var dest = __dirname+"/projects/"+req.body.index+"/"+req.body.snapshot;
							fs.unlink(dest,function(err){
								if (err) {
							  		console.log(err);
							  		res.send("Error!");
							  		return;
								}
								res.send(req.body.snapshot+" delete Success!");
							});
						}else{
							res.redirect('/loginpage');
						}
					});
				}else{
					res.redirect('/loginpage');
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
	
	//Project Edit Post
	app.post('/Project_edit_edit',function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					//Backup data to text file
					var Project_Index=req.body.Index;
					var verify=0;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var qrystr="UPDATE Cpp2015.Project_Table SET title= :Title , subtitle= :Subtitle , description= :Description , win_path= :Win , linux_path= :Linux , mac_path= :Mac ";
							if((view_perm=="Admin")||(view_perm=="Owner")){
								qrystr=qrystr+", author= :Author , category= :Work ";
							}
							qrystr=qrystr+"WHERE project_index= :Index ;";
							AdmDB.query(qrystr,{
								Index: Project_Index,
								Title: req.body.Title,
								Subtitle: req.body.Subtitle,
								Description: req.body.Description,
								Win: req.body.Win,
								Linux: req.body.Linux,
								Mac: req.body.Mac,
								Author: req.body.Author,
								Work: req.body.Work
							})
							.on('result',function(res){
								res.on('error',function(err){
									console.log(req.ip+': Error- '+err);
								})
							})
							.on('end',function(){
								var fs=require('fs');
								var dest=__dirname+"/projects/"+Project_Index+"/cover_preview";
								fs.exists(dest, function (exists) {
									if(exists){
										fs.exists(__dirname+"/projects/"+Project_Index+"/cover",function(coverExist){
											if(coverExist){
												fs.unlink(__dirname+"/projects/"+Project_Index+"/cover",function(err){
													if(err){
														console.log(req.ip+': Error- '+err);
														res.send("Error");
													}else{
														fs.rename(dest,__dirname+"/projects/"+Project_Index+"/cover",function(err){
															if(err){
																console.log(req.ip+': Error- '+err);
																res.send("Error");
															}else{
																res.send("OK");
															}
														});
													}
												});
											}else{
												fs.rename(dest,__dirname+"/projects/"+Project_Index+"/cover",function(err){
													if(err){
														console.log(req.ip+': Error- '+err);
														res.send("Error");
													}else{
														res.send("OK");
													}
												});
											}
										});
									}else{
										res.send("OK");
									}
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
		}else{
			res.redirect('/loginpage');
		}
	});
	
	// Project file Upload
	app.post('/Project_file_upload',multipartMiddleware,function(req,res){
		if(req.session.login==true){
			var view_perm='';
			var exist=0;
			// Get viewer permission
			DB.query("SELECT * FROM Cpp2015.Account_Table WHERE id= :id;",{id: req.session.id})
			.on('result',function(res){
				res.on('row',function(row){
					view_perm=row.permission;
					if(row.password==req.session.password){
						exist=1;
					}
				})
				.on('error',function(err){
					console.log(req.ip+': Error- '+err);
				})
			})
			.on('end',function(){
				// Get Data
				if(exist==1){
					var Project_Index=req.body.index;
					var verify=0;
					var Pic_count;
					var Old_Path;
					var Type_prefix;
					DB.query("SELECT * FROM Cpp2015.Project_Table WHERE project_index= :index;",{index: Project_Index})
					.on('result',function(res){
						res.on('row',function(row){
							var SplitAuthor=row.author.split(",");
							for(var j=0;j<SplitAuthor.length;++j){
								if((SplitAuthor[j]==req.session.id)||(view_perm=="Admin")||(view_perm=="Owner")){
									verify=1;
									Pic_count=row.pic_count;
									if(req.body.type=="win"){
										Old_Path=row.win_path;
										Type_prefix="File_Win_";
									}else{
										if(req.body.type=="linux"){
											Old_Path=row.linux_path;
											Type_prefix="File_Linux_";
										}else{
											Old_Path=row.mac_path;
											Type_prefix="File_Mac_";
										}
									}
									break;
								}
							}
						})
						.on('error',function(err){
							console.log(req.ip+': Error- '+err);
						})
					})
					.on('end',function(){
						if(verify==1){
							var fs = require('fs');
							var tmpPath = req.files.upload.path;
							var dest = __dirname+"/projects/"+req.body.index+"/"+Type_prefix+req.files.upload.name;
							fs.readFile(tmpPath, function(err, data) {
								if (err) {
									console.log(err);
									res.send("Error");
									return;
								}
								fs.exists(dest,function(exist){
									if(exist){
										fs.unlink(dest,function(err){
											if(err){
										  		console.log(err);
										  		res.send("Error");
										  		return;
											}
											fs.writeFile(dest, data, function(err) {
												if (err) {
											  		console.log(err);
											  		res.send("Error");
											  		return;
												}
												fs.unlink(tmpPath,function(err){
													if (err) {
												  		console.log(err);
												  		res.send("Error");
												  		return;
													}
													res.send("OK");
												});
										  	});
										});
									}else{
										fs.writeFile(dest, data, function(err) {
											if (err) {
										  		console.log(err);
										  		res.send("Error");
										  		return;
											}
											fs.unlink(tmpPath,function(err){
												if (err) {
											  		console.log(err);
											  		res.send("Error");
											  		return;
												}
												res.send("OK");
											});
									  	});
									}
								});
							});
							fs.exists(__dirname+"/projects/"+req.body.index+"/"+Old_Path,function(exist){
								if(exist){
									fs.unlink(__dirname+"/projects/"+req.body.index+"/"+Old_Path,function(err){
										if(err){
									  		console.log(err);
										}
									});
								}
							});
						}else{
							res.redirect('/loginpage');
						}
					});
				}else{
					res.redirect('/loginpage');
				}
			});
		}else{
			res.redirect('/loginpage');
		}
	});
}
