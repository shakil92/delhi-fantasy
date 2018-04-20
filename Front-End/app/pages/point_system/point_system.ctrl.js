'use strict';

app.controller('pointSystemCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){
	
	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
	$scope.env = environment;
	
	$scope.active = 't20';
	
	$scope.gotoTab = function(tab){
		$scope.active = tab;
	}
	
	$scope.getPointSystemData = function(){
		appDB.callPostForm('user/point_system').then(
       		function success(data){ 
         		if(data.code == 200 && data.status == 1){ 
        			$scope.pointSystemData = data.response;	
      			} 
        	},
      		function error(data){           
	           $scope.contestError = true;
	           $scope.contestErrorMsg= data.message;
         	}
        );
	}
		
}]);