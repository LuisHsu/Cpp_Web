var express=require('express.io');
var bodyParser=require('body-parser');
var maria=require('mariasql');
var fs=require('fs');
var inspect=require('util').inspect;
var AES = require("crypto-js/aes");
var cookieSession=require('cookie-session');

//temp variable
var c=0;

// Connect to Database
var DB=new maria();
DB.connect({
		host: "140.116.246.195",
		user: "visitor",
		password: "z8ruarabsswv9m9d",
		db: "Cpp2015"
	});
DB.on('connect',function(){
		console.log('Database Connected');
	})
	.on('error',function(err){
		console.log('Database Connect error');
		console.log(err);
	})
	.on('close',function(){
		console.log('Database Connect Close');
	});

// Get Category
var Category=new Array();
DB.query('SELECT DISTINCT category FROM Cpp2015.Project_Table;')
	.on('result',function(res){
		res.on('row',function(row){
			Category[c]=row.category;
			c+=1;
		})
		.on('error',function(err){
			console.log("Failed to get category"+': Error- '+inspect(err));
		})
	})
	.on('end',function(){	
		console.log('Category loading success!');
	});

/*** Express ***/
var app=express();

// Parse json
app.use(bodyParser.json());

// Set to get ip
app.enable('trust proxy');

// Set ejs
app.set('view engine','ejs');

// Session
app.use(cookieSession({secret: 'cpp103class'}));

// Route and Login
require('./route')(app,DB,Category);
require('./backstage')(app,DB,Category,AES);
require('./project')(app,DB,AES);

// Project file
app.use('/projects',express.static(__dirname+'/projects'))

// Static file
app.use(express.static(__dirname+'/resourses'));

// Listen
app.listen(8080,function(){
	console.log("PD2 game website Started");
});
