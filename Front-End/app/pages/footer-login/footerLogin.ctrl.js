'use strict';

app.directive('footerLogin',['environment',function(environment){
	return {
		restrict: 'E',
		templateUrl:'Front-End/app/pages/footer-login/footerLogin.html',
		link: function(scope, element, attributes){
			scope.env = environment;
		}
	};
}]);