var express=require('express');
var bodyParser=require('body-parser');
var fs=require('fs');
var inspect=require('util').inspect;

/*** Express ***/
var app=express();

//Parse json
app.use(bodyParser.json());

// Set to get ip
app.enable('trust proxy');

// Set ejs
app.set('view engine','ejs');

//Serve ejs file
app.get('/', function(req,res){
	res.render('pages/index');
});

app.use(express.static(__dirname+'/resourses'));

// Listen
app.listen(8080,function(){
	console.log("Test website Started");
});