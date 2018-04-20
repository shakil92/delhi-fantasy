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

	let $data = {page_id:'HOW_TO_PLAY'};
    appDB
    .callPostForm('user/page',$data) 
    .then(
      function success(data){ 
        if(data.code == 200 && data.status == 1){ 
            $scope.page_content = data.response.description;
        } 
      },
      function error(data){
        if (data!=null) {         
           $scope.page_content = 'No Data Found!';
        }
      }
      );

}]);