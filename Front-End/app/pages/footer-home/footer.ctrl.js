'use strict';
app.directive('footerHome',function(){
	return {
		restrict: 'E',
		controller:'footerCtrl',
		templateUrl:'Front-End/app/pages/footer-home/footer.html',
		link: function(scope, element, attributes){
			
		}
	};
});

app.controller('footerCtrl',['$scope','$rootScope','$location','$window','$state','environment',function($scope,$rootScope,$location,$window,$state,environment){
	$scope.env = environment;
	$scope.abc = function(){
		$state.go('point-system');
	}
}]);