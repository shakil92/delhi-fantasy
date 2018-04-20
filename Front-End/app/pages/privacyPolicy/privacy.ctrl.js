'use strict';

app.controller('privacyCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment','$stateParams',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment,$stateParams){

    if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
    $scope.currentActiveTab = '';
    $scope.env = environment;
    $scope.changeCurrentTab = function(x){
        $scope.currentActiveTab = x;
        $scope.setContent(x);
    }
    $scope.setContent = function(a){
        let page_id = '';
        $scope.page_content = '';
        switch(a){
            case 1:
            page_id = 'privacy_policy';
            break;
            case 2:
            page_id = 'terms_condition';
            break;
            case 3:
            page_id = 'promotions';
            break;
            default:
            page_id = 'privacy_policy'; 
        };
        let $data = {};
        $data.page_id = page_id;
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
    }
    if($stateParams.hasOwnProperty('q') && $stateParams.q!='')
    {
        $scope.changeCurrentTab($stateParams.q);        
        $scope.setContent($stateParams.q);
    }
    else
    {
        $scope.currentActiveTab = 1;
        $scope.setContent(1);
    }

}]);