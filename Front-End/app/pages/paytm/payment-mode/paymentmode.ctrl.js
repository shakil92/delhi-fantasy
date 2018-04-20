app.controller('paymentMode',['$scope','$rootScope','$location','$window','$localStorage','appDB','environment','$sessionStorage',function($scope,$rootScope,$location,$window,$localStorage,appDB,environment,$sessionStorage){

    $scope.env = environment;
    $scope.currentActiveTab = 1;
    $scope.changeCurrentTab = function(x){
        $scope.currentActiveTab = x;
    }
    if($sessionStorage.hasOwnProperty('action') && $sessionStorage.action.hasOwnProperty('amount'))
    {
        $scope.amountMoney = $sessionStorage.action.amount;
    }
    else if($rootScope.hasOwnProperty('addBalance') && $rootScope.addBalance.hasOwnProperty('amount'))
    {
        $scope.amountMoney = $rootScope.addBalance.amount;
    }
    else
    {
        $location.url('/contest');
    }
}]);