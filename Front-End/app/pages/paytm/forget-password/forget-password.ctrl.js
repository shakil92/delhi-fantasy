'use strict';

app.controller('forgetPasswordCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,environment){

	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$location.url('/');
	}
	$scope.env = environment;
	$scope.formData =  {};
	$scope.formDataCode = {};
	$scope.formDataR =  {};
	
	$scope.formData.error = {};
	$scope.formDataCode.error = {};
	$scope.formDataR.error = {};

	$scope.errormessage = {};
	
	$scope.submitted = false;
	$scope.codesubmitted = false;
	$scope.resetsubmitted = false;

	$scope.reset_error = false;
	$scope.reset_message = '';

	$scope.step_1 = true;
	$scope.step_2 = false;
	$scope.step_3 = false;
   
   /*Remove Server Side  Massage  */
	$scope.removeMassage = function(){       
		 $scope.login_error = false;
		 $scope.reset_error = false;
	}

	/*Handling Signup Step -1 */
	$scope.sendEmail = function(form){		
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
		$scope.formDataR.email = $scope.formData.email;
		appDB
		.callPostForm('user/forgot_password',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.code == 200 && data.status == 1)
					{ 
						$scope.step_2 = true;
						$scope.step_1 = false;
						$scope.code_title = data.message;
						$scope.login_key = data.response.login_session_key;
						$scope.login_error = false;
						$scope.login_message = '';
					} 
				} 
			},
			function error(data)
			{ 
				$scope.login_error = true;
				$scope.login_message = data.message;
			}
			);
		
	}

	$scope.reset = function(form){
		$scope.helpers = Mobiweb.helpers;
		$scope.reset_error = false;
		$scope.reset_message = '';
		$scope.resetsubmitted = true;
		if(!form.$valid)
		{
			return false;
		}
		var _that = $scope;
		$scope.formDataR['vCode'] = $scope.formDataR.vcode
		$scope.formDataR['new_password'] = $scope.formDataR.pass;
		$scope.formDataR['cnfm_password'] = $scope.formDataR.passc;
		$scope.formDataR['email'] = $scope.formDataR.email;

		var data = $scope.formDataR;
		appDB
		.callPostForm('user/reset_password',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.code == 200 && data.status == 1)
					{ 
						$rootScope.forgetPasswordSuccess=data.message+"!"; 
						$location.url('/login');						
					} 
				} 
			},
			function error(data)
			{ 
				$scope.reset_error = true;
				$scope.reset_message = data.message;
			}
			);		
	}
}]);