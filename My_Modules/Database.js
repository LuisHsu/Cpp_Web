var maria=require('mariasql');

var ModuleObj=module.exports=function(h,u,p,d){
	// Connect
	this.client=new maria();
	client.connect({
		host: h,
		user: u,
		password: p || '',
		db: d
	});

	c.on('connect',function(){
		console.log('Connent to Database Successful');
	})
	.on('error',function(err){
		
	})
}


