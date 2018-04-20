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
	  case '/login': 
	  $scope.showButton=0;
	  break; 
	  case '/signup':
	  $scope.showButton=0;
	  break; 
	  default:
	  $scope.showButton=1;
  }
  if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
  {
	  $scope.showButton = 0;
  }
  $scope.isAffiliate = false;
  if($location.path()=='/affiliate')
  {
	  $scope.isAffiliate = true;
  }
  
}]);