'use strict';
 app.controller('howtoplayCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){
    if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
	$scope.env = environment;
	$scope.isActive = 1;
	$scope.changeActiveTab = function(a)
	{
		$scope.isActive = a;
	}

}]);