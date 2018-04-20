'use strict';

app.controller('aboutCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){
 
    $scope.env = environment;
    if($localStorage.hasOwnProperty('isLoggedIn'))
    {
        $scope.isLoggedIn = true;
    }
    else
    {
        $scope.isLoggedIn = false;
    }
    let $data = {page_id:'about '};
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