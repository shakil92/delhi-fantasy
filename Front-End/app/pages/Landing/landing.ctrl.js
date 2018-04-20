'use strict';

app.controller('landingCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){
 
    $scope.env = environment;
    if($localStorage.hasOwnProperty('isLoggedIn'))
    {
        $scope.isLoggedIn = true;
    }
    else
    {
        $scope.isLoggedIn = false;
    }
    
	
}]);