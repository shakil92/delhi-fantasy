'use strict';

app.directive('headerLogin',['$location',function($location){
	return {
		restrict: 'E',
		controller: 'headerLoginCtrl',
		templateUrl:'Front-End/app/pages/header-login/headerLogin.html',
		link: function(scope, element, attributes){
		}
	};
}]);
app.controller('headerLoginCtrl',['$scope','$rootScope','$location','$localStorage',function($scope,$rootScope,$location,$localStorage){
  $scope.showButton = 0;
  
  switch($location.path())
  {
	  case '/': 
	  $scope.showButton=1;
	  break; 
	  case '/forget-password':
	  $scope.showButton=1;
	  break; 
	  default:
	  $scope.showButton=0;
  }
  if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
  {
	  $scope.showButton = 1;
  }
}]);