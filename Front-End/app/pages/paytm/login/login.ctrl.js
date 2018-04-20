'use strict';

app.controller('loginCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment','process','$timeout','$sessionStorage',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment,process,$timeout,$sessionStorage){
    $scope.loginHandler = process.login;
	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$location.url('/');
	}
	$scope.env = environment;
	$scope.formData =  {};
	$scope.formDataCode = {};
	
	$scope.formData.error = {};
	$scope.formDataCode.error = {};

	$scope.errormessage = {};
	$scope.submitted = false;
	$scope.codesubmitted = false;
	$scope.access_error = false;
	$scope.access_message = '';

	$scope.step_1 = true;
	$scope.step_2 = false;

	if($rootScope.hasOwnProperty('signupSuccess'))
	{
		$timeout(function(){
			$scope.openPopup('success_signup');
			$sessionStorage.firstLogin = true;
			delete $rootScope.signupSuccess;
		}.bind($scope),1000);
		
	}
	if($rootScope.hasOwnProperty('forgetPasswordSuccess'))
	{
		$timeout(function(){
			$scope.openPopup('success_forget');
			delete $rootScope.forgetPasswordSuccess;
		}.bind($scope),1000);
	}
	/*Remove Server Side  Massage  */
	$scope.removeMassage = function(){       
		 $scope.login_error = false;
	}
	$scope.processNow = function(x,y){
		console.log(x);
		if(typeof $scope[x] === 'function'){
			$scope[x](y);
		}
		else
		{
			console.log('---Something went wrong!');
		}
	}
	/*Handling Signup Step -1 */
	$scope.serverProcess = function(form){
		$scope.helpers = Mobiweb.helpers;
		$scope.login_error = false;
		$scope.login_message = '';
		$scope.submitted = true;
		if(!form.$valid)
		{
			return false;
		}
		var _that = $scope;
		$scope.formData.signup_type = 'WEB';
		var data = $scope.formData;
		appDB
		.callPostForm('user/login',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.code == 200 && data.status == 1)
					{
						$localStorage.userDetails = data.response;
						$localStorage.isLoggedIn = true;
						$localStorage.walletBalance = 0;
						$window.location.href = '#/contest';
						setTimeout(function(){$scope.reloadPage();},50);  
					} 
				} 
			},
			function error(data)
			{ 
				if(typeof data == 'object')
				{
					$scope.login_error = true;
					$scope.login_message = data.message;
				}

			}
			);
		
	}


	$scope.reloadPage=function(){
		$window.location.reload();
	}
	/*Handling Code Submission Step -2 */
	$scope.socialProcess = function(){
		console.log("Inside socialLogin function ");
		$scope.$on('event:social-sign-in-success', (event, userDetails)=> {
			$scope.result = userDetails;
			console.log("header page "+JSON.stringify(userDetails));
			var full_name=userDetails.name;
			var email=userDetails.email;
			var social_id=userDetails.uid;
			var socila_type=userDetails.provider;
			var imageUrl=userDetails.imageUrl;

			if (userDetails!=null) {
				var socialData={
					name:full_name,
					email:email,
					social_id:social_id,
					social_signup_type:socila_type,
					signup_type:'WEB',
					imageUrl:imageUrl,
					language:"en"
				}
				//$location.url('/');
				appDB.callPostForm('user/socialSignIn',socialData)
				.then(function successCallback(response) {
					console.log("login api response "+JSON.stringify(response));
					if(response.status==1){
						$scope.errorCode = 1;
						$scope.isLoggedIn = true;
						
						$localStorage.userDetails = response.response;
						$localStorage.isLoggedIn = true;
						$localStorage.walletBalance = 0;

						$location.url('/');
					}
					else{
						$scope.errorCode = 1;
						$scope.message = "There is a problem in social Sign In! Please try again later.";
						$scope.isLoggedIn= false;
					}

				},function errorCallback(response){
					$scope.errorCode = 1;
					$scope.message = "There is a problem in social Sign In! Please try again later.";
					$scope.isLoggedIn= false;
				})	
			}
		})
	}

}]);