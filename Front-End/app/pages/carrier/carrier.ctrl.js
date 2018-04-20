app.controller('carrierCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$sessionStorage','environment','$stateParams',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$sessionStorage,environment,$stateParams){

    if($localStorage.hasOwnProperty('isLoggedIn'))
    {
        $scope.isLoggedIn = true;
    }
    else
    {
        $scope.isLoggedIn = false;
    }
    $scope.submitCarrierForm = function(form){
        $scope.submitted = true;
        $scope.success= false;
        $scope.error = false;
        $scope.successMsg = '';
        $scope.errorMsg = '';
        if(!form.$valid)
        {
            return false;
        }
        if($scope.carrier.resume==null)
        {
            return false;
        }
        var fd = new FormData();
        fd.append('full_name',$scope.carrier.name);
        fd.append('email',$scope.carrier.email);
        fd.append('phone',$scope.carrier.phone);
        fd.append('subject',$scope.carrier.subject);
        fd.append('message',$scope.carrier.message);
        fd.append('image',$scope.carrier.resume);
        fd.append('user_id','1');
        appDB
        .callPostImage('user/career',fd) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                   let v = data;
                   $scope.carrier = {};
                   $scope.submitted = false;
                   $scope.success = true;
                   $scope.successMsg = "Resume has been submitted successfully.";
                 } 
            },
            function error(data){ 
                $scope.errorMsg = data.message; 
                $scope.error = true;
                $scope.errorMsg = "Resume has not been submitted successfully.";
             }
            );
       }
        $scope.env = environment;
}]);