'use strict';

app.controller('faqCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){

    if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
	$scope.env = environment;
    $scope.expandedAria = 'one';
    $scope.expandAria = function(tab){
        if($scope.expandedAria==tab)
        {
            $scope.expandedAria = '';
        }
        else
        {
            $scope.expandedAria = tab;
        }
    }
	
}]);