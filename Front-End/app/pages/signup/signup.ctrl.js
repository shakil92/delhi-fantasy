'use strict';

app.controller('signupCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','$stateParams','socialLoginService','environment','process','$sessionStorage',function($scope,$localStorage,$rootScope,$location,appDB,$sce,$stateParams,socialLoginService,environment,process,$sessionStorage){
	
	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$location.url('/contest');
	}
	$scope.env = environment;
	$scope.signUpHandler = process.signup;
	$scope.stateParams = $stateParams;	
	if($scope.stateParams.referral!=null)
	{
		$sessionStorage.referral_invite_code = $scope.stateParams.referral;
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
	$scope.get18YearsAge = function(){
		/*Count 18 years from today- start*/
		var d = new Date();
		var year = d.getFullYear() - 18;
		$scope.date=d.setFullYear(year);
		$scope.dobValidate=d; 
		/*Count 18 years from today- end*/
	}
	$scope.setDefaultDob = function(){
		$scope.get18YearsAge();
		$scope.setDefaultDate=$scope.dobValidate;
	}
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
	
    /*Remove Server Side  Massage  */
	$scope.removeMassage = function(){       
		 $scope.sign_error = false;
	}

	/*Handling Signup Step -1 */
	$scope.serverProcess = function(form){
		$scope.helpers = Mobiweb.helpers;
		$scope.sign_error = false;
		$scope.errormessage = '';
		$scope.submitted = true;
		if(!form.$valid)
		{
			return false;
		}		
		var _that = $scope;
		$scope.formData.signup_type = 'WEB';
		var data = $scope.formData;
		if($sessionStorage.hasOwnProperty('referral_invite_code'))
		{
			data.invite_code = $sessionStorage.referral_invite_code;
		}
		appDB
		.callPostForm('user/signup',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.status==1)
					{
                        $rootScope.signupSuccess=data.message+"!"; 
						$location.url('/login');
					}
				} 
			},
			function error(data)
			{ 
				$scope.sign_error = true;
				$scope.errormessage = data.message;
				/*$scope.errormessage[data.response.field] = data.message;*/
			}
			);

	}
	/*Handling Code Submission Step -2 */
	$scope.authenticate = function(form){
		$scope.helpers = Mobiweb.helpers;
		$scope.codesubmitted = true;
		if(!form.$valid)
		{
			return false;
		}
		$scope.formDataCode['email'] = $scope.formData.email;
		var data = $scope.formDataCode;
		appDB
		.callPostForm('user/profile_verified',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200 && data.status == 1)
				{ 
					$localStorage.userDetails = data.response;
					$localStorage.isLoggedIn = true;
					$localStorage.walletBalance = 0;
					$location.url('/');
				} 
			},
			function error(data)
			{ 
				$scope.access_error = true;
				$scope.access_message = data.message;	
			}
			);
	}
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
