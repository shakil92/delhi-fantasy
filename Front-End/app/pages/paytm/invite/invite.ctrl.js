app.controller('inviteCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB','$filter','environment',function($scope,$rootScope,$location,$window,$localStorage,appDB,$filter,environment){
   $scope.env = environment; 
   $scope.submitted = false;
   $scope.userDetails = $localStorage.userDetails;
   $scope.$watch('mobile',function(newVal,oldVal){
        if(newVal!=oldVal && typeof newVal!='undefined' && newVal!='')
        {
            delete $scope.success;
            delete $scope.successMsg;
            delete $scope.error;
            delete $scope.errorMsg;     
        }
   });
   /*Current Tab*/
   $scope.currentTab = 'sms';
   $scope.changeCurrentTab = function(tab){
        delete $scope.success;
        delete $scope.successMsg;
        delete $scope.error;
        delete $scope.errorMsg;
        $scope.currentTab = tab;
    }
   $scope.inviteFriend = function(form)
   {   delete $scope.success;
       delete $scope.successMsg;
       delete $scope.error;
       delete $scope.errorMsg;
       $scope.submitted = true;
       if(!form.$valid)
       {
        return false;
       }
       var $data = {};
       $data.login_session_key = $localStorage.userDetails.login_session_key;
       $data.mobile = $scope.mobile;
       appDB
       .callPostForm('user/invite_friend',$data) 
       .then(
           function success(data){ 
               
               if(data.code == 200 && data.status == 1){ 
                    $scope.success = true;
                    $scope.successMsg = 'Your friend has been invited successfully!'; 
                    $scope.submitted = false;
                    $scope.mobile = ''; 
        
               } 
               else if(data.status ==2)
               {
                    $scope.error = true;
                    $scope.errorMsg = 'Your friend has not been invited successfully!';
                    $scope.submitted = false;
                    $scope.mobile = ''; 
                }
               
           },
           function error(data){ 
                    $scope.error = true;
                    $scope.errorMsg = 'Your friend has not been invited successfully!';
                    $scope.submitted = false;
                    $scope.mobile = ''; 
           }
        );
   }
   $scope.inviteFriendEmail = function(form)
   {   delete $scope.success;
       delete $scope.successMsg;
       delete $scope.error;
       delete $scope.errorMsg;
       $scope.submittedemail = true;
       if(!form.$valid)
       {
        return false;
       }
       var $data = {};
       $data.login_session_key = $localStorage.userDetails.login_session_key;
       $data.email = $scope.email;
       appDB
       .callPostForm('user/invite_friend',$data) 
       .then(
           function success(data){ 
               
               if(data.code == 200 && data.status == 1){ 
                    $scope.success = true;
                    $scope.successMsg = 'Your friend has been invited successfully!'; 
                    $scope.submittedemail = false;
                    $scope.mobile = ''; 
        
               } 
               else if(data.status ==2)
               {
                    $scope.error = true;
                    $scope.errorMsg = 'Your friend has not been invited successfully!';
                    $scope.submitted = false;
                    $scope.mobile = ''; 
                }
               
           },
           function error(data){ 
                    $scope.error = true;
                    $scope.errorMsg = 'Your friend has not been invited successfully!';
                    $scope.submitted = false;
                    $scope.mobile = ''; 
           }
        );
   }

}]);