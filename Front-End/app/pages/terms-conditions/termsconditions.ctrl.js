'use strict';

app.controller('terms_conditionsCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService){

	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$location.url('/');
	}


}]);
