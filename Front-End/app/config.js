app.constant('sportsCollection',{
	teamPlayerLimit :11
});
app.constant('environment',{
	base_url:'http://delhi.fantasy96.com/api/v2/',
	main_url:'http://delhi.fantasy96.com/',
	image_base_url:'http://delhi.fantasy96.com/Front-End/images/',
	brand_name: 'The TeamGenie'
});
app.constant('process',{
	login :{
		a: 'serverProcess',
		b: 'socialProcess'		
	},
	signup : {
		a: 'serverProcess',
		b: 'socialProcess'
	}
});
app.constant('sociallink',{
	facebook:'https://www.facebook.com/theteamgenie-200990023785327',
	twitter:'https://twitter.com/theteamgenie',
	google:'',
	insta:'https://www.instagram.com/theteamgenie/'
});
app.constant('CSS',{
	errormsg_box:'form-error',
});

app.config(function(socialProvider){
	socialProvider.setGoogleKey("970113603492-psmgipi4sebmbg4n155nh4nhf0ul40jo.apps.googleusercontent.com");
	socialProvider.setFbKey({appId: "183653765582118", apiVersion: "v2.11"});
});


