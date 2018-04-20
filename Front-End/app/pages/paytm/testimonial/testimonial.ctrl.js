'use strict';
 app.controller('testimonialCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment','$timeout',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment,$timeout){
	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
	$scope.env = environment;
	$scope.env = environment;
	$scope.openTestimonial = function(){
		$scope.openPopup('write_testimonial')
		$scope.testimonialForm = {};
		$scope.testimonialForm.name = $localStorage.userDetails.name;
		$scope.testimonialForm.email = $localStorage.userDetails.email;
		$scope.testimonialForm.rating = 0;
	}
	$scope.showTestimonial = function(form){
		let $data = {};
		$data.limit = 10;
		$data.offset = 0;
		appDB
		.callPostForm('user/testimonial_list',$data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.status==1)
					{	
						$scope.testimonialList = data.response;
					}
					else
					{
						$scope.testimonialList = [];						
					}
				} 
			},
			function error(data)
			{ 
				$scope.testimonialList = [];
			}
			);
	}
	$scope.showTestimonial();
	$scope.submitTestimonial = function(form){
		$scope.submitted = true;
		if(!form.$valid)
		{
			return false;
		}
		var data = $scope.testimonialForm;
		data.login_session_key = $localStorage.userDetails.login_session_key;
		data.user_id = $localStorage.userDetails.user_id;
		appDB
		.callPostForm('user/testimonial',data) 
		.then(
			function success(data)
			{ 
				if(data.code == 200)
				{ 
					if(data.status==1)
					{	$scope.success = true;
                        $scope.successMessage="*"+data.message+"!"; 
						$timeout(function(){
							$scope.closePopup('write_testimonial');
						}.bind($scope),2000);
					}
					else
					{
						$scope.error = true;
                        $scope.errorMessage="*"+data.message+"!"; 
						
					}
				} 
			},
			function error(data)
			{ 
				$scope.error = true;
				$scope.errorMessage="*"+data.message+"!";
			}
			);

	}
}]);