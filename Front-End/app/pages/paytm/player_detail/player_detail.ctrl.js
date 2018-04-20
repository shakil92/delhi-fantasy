'use strict';
app.controller('playerDetailCtrl',['$stateParams','environment','$scope','$rootScope','$location','$window','$localStorage','appDB',function($stateParams,environment,$scope,$rootScope,$location,$window,$localStorage,appDB){
   if($localStorage.isLoggedIn==true){        
        $scope.player_id = $stateParams.id;
        var data={};
        data.login_session_key= $localStorage.userDetails.login_session_key;
        data.player_id= $scope.player_id;
        $scope.playerDetails = [];
        appDB
        .callPostForm('match/player_details',data)
        .then(
            function success(data) {
              if(data.code == 200 && data.status == 1){ 
                 $scope.playerDetails = data.response;
                 $scope.playerDetails.player_pic = environment.image_base_url+data.response.player_pic;
                //$scope.errorMsg=""; 
              } 
            },
            function error(data) {
                 //$scope.errorMsg = data.message; 
            }
          );      
    }
}]);