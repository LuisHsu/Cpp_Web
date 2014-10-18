var express=require('express');
var bodyParser=require('body-parser');

var app=express();
app.use(express.static(__dirname + '/Test_Pages'));

app.use(bodyParser.json());

app.post('/login',function(req,res){
	res.status(200).send(req.body.Account+',Login Successed!');
	res.end();
});

app.listen(8080,function(){
	console.log("Test website Started");
});


