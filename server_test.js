var express=require('express');
var bodyParser=require('body-parser');
var maria=require('mariasql');
var fs=require('fs');
var inspect=require('util').inspect;

//Database
var DB=new maria();
DB.connect({
		host: "localhost",
		user: "root",
		password: "cpp2015",
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
	
/*** Express ***/
var app=express();
// Set to get ip
app.enable('trust proxy');

// Set ejs
app.set('view engine','ejs');

//Serve ejs file

// Redirect root
app.get('/' , function(req,res){
	res.redirect('/index');
});

app.get('/index', function(req,res){
	res.render('index',
	{
		titles : [123,456],
		authors : [123,456],
		subtitles : [123,456],
		names : [123,456],
		descriptions : [123,456],
		pics : ['ContentPic/Downstair/1/icon.png','ContentPic/Downstair/1/icon.png']
	});
});

app.use(express.static(__dirname + '/Test_Pages'));

//Parse json
app.use(bodyParser.json());

// Login
app.post('/login',function(req,res1){
	var ret=0;
	DB.query('SELECT ID FROM Cpp2015.`Account_Table` where ID=? and Password=?;'
	,[req.body.UserName,req.body.Password])
	.on('result',function(res){
		res.on('row',function(row){
			ret=1;
		})
		.on('error',function(err){
			console.log(req.ip+': Error- '+inspect(err));
		})
	})
	.on('end',function(){
		if(ret==0){
			res1.status(200).send("Login Failed");
			console.log(req.ip+': Login Failed');
		}else{
			res1.status(200).send(req.body.UserName+' Logined!');
			console.log(req.ip+': '+req.body.UserName+' Login');
		}
		res1.end();
	});
});

// Listen
app.listen(8080,function(){
	console.log("Test website Started");
});


