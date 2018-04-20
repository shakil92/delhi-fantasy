'use strict';

app.directive('profileSidebar',function(){
	return {
		restrict: 'E',
		controller:'profileSidebarCtrl',
		templateUrl:'Front-End/app/pages/profile-sidebar/profile-sidebar.html',
		link: function(scope, element, attributes){
		   scope.activePage = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);	
		}
	};
});

app.controller('profileSidebarCtrl',['$scope','$rootScope','$location','$window','$localStorage',function($scope,$rootScope,$location,$window,$localStorage){

	$scope.logout = function()
	{
		delete $localStorage.isLoggedIn;
		$location.url('/login');
	}
}]);