'use strict';
 app.controller('contactCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment','$timeout','sociallink',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment,$timeout,sociallink){
	$scope.env = environment;
	if($localStorage.hasOwnProperty('isLoggedIn'))
    {
        $scope.isLoggedIn = true;
    }
    else
    {
        $scope.isLoggedIn = false;
	}
	$scope.social = sociallink;
	$scope.contactForm = {};
	$scope.submitted = false;
	$scope.submitContact = function(form){
		$scope.submitted = true;
		if(!form.$valid)
		{
			return false;
		}
		var data = $scope.contactForm;
		appDB
		.callPostForm('user/contact_us',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.status==1)
					{
					   $scope.submitted = false;
					   $scope.success = true;
					   $scope.successmessage = data.message;
					   $scope.contactForm = {};
					   $timeout(function(){
							$scope.success = false;
							$scope.error = false;
							$scope.successmessage = '';
							$scope.errormessage = '';
					   }.bind($scope),3000);
					}
					else
					{
						$scope.submitted = false;
						$scope.error = true;
						$scope.errormessage = data.message;
					}
				} 
			},
			function error(data)
			{ 
				$scope.submitted = false;
				$scope.error = true;
				$scope.errormessage = data.message;

			}
			);
		
	}
}]);