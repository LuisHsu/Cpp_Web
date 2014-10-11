var express=require('express');

var app=express();
app.use(express.static(__dirname + '/Test_Pages'));
app.listen(8080,function(){
	console.log("Test website Started");
});
