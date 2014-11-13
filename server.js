var express=require('express');
var bodyParser=require('body-parser');
var maria=require('mariasql');
var fs=require('fs');
var inspect=require('util').inspect;

//temp variable
var c=0;

//Database
var DB=new maria();
DB.connect({
		host: "140.116.246.195",
		user: "visitor",
		password: "Abcd1234",
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
	
//Category
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

//Parse json
app.use(bodyParser.json());

// Set to get ip
app.enable('trust proxy');

// Set ejs
app.set('view engine','ejs');

// Redirect
app.get('/', function(req,res){
	res.redirect('/works?work=all&order=Latest');
});

// Works
app.get('/works', function(req,res){
	var titles=new Array();
	var subs=new Array();
	var auths=new Array();
	var descs=new Array();
	var indices=new Array();
	var pics=new Array();
	var Title_Work='';
	var qstring='SELECT * FROM Cpp2015.Project_Table ';
	var Class_Latest='';
	var Class_Download='';
	var CurWork='';
	c=0;
	if(req.query.work=="all"){
		CurWork="*";
		Title_Work="All Works";
	}else{
		CurWork=req.query.work;
		Title_Work=req.query.work;
		qstring=qstring+" WHERE category='"+req.query.work+"'";
	}
	if(req.query.order=="Download"){
		qstring+=" ORDER BY popularity DESC;";
		Class_Download="sortclicked";
		Class_Latest="sortbutton";
	}else{
		qstring+=" ORDER BY update_time DESC;";
		Class_Download="sortbutton";
		Class_Latest="sortclicked";
	}
	DB.query(qstring)
	.on('result',function(res){
		res.on('row',function(row){
			titles[c]=row.title;
			subs[c]=row.subtitle;
			auths[c]=row.author;
			descs[c]=row.description;
			indices[c]=row.index;
			pics[c]="projects/"+row.index+"/cover";
			c+=1;
		})
		.on('error',function(err){
			console.log(req.ip+': Error- '+inspect(err));
		})
	})
	.on('end',function(){
		res.render('pages/works',{
				titles: titles,
				subtitles: subs,
				authors: auths,
				descriptions: descs,
				indices:indices,
				pics: pics,
				Class_Latest: Class_Latest,
				Class_Download: Class_Download,
				work:Title_Work,
				categories:Category
			});
	});
});

// Project file
app.use('/projects',express.static(__dirname+'/projects'))

// Static file
app.use(express.static(__dirname+'/resourses'));

// Listen
app.listen(8080,function(){
	console.log("Test website Started");
});
