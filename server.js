var express=require('express.io');
var bodyParser=require('body-parser');
var maria=require('mariasql');
var fs=require('fs');
var inspect=require('util').inspect;
var AES = require("crypto-js/aes");
var cookieSession=require('cookie-session');
var fn = require('./upload');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// Connect to Database
var DB=new maria();
DB.connect({
		host: "192.168.0.103",
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

var AdmDB=new maria();
AdmDB.connect({
		host: "192.168.0.103",
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

// Get Category
var Category=new Array();

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
require('./route')(app,DB,Category,AdmDB);
require('./backstage')(app,DB,Category,AES,AdmDB);
require('./project')(app,DB,AES,Category,multipartMiddleware,AdmDB);


app.post('/upload',multipartMiddleware, fn);

// Project file
app.use('/projects',express.static(__dirname+'/projects'))

// Static file
app.use(express.static(__dirname+'/resourses'));

// Listen
app.listen(8080,function(){
	console.log("PD2 game website Started");
});
