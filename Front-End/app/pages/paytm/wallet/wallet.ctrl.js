app.controller('walletCtrl', ['$scope','environment', '$rootScope', '$location', '$window', '$localStorage', 'appDB', 'sportsCollection','$interval', function($scope,environment, $rootScope, $location, $window, $localStorage, appDB, sportsCollection,$interval) {
  $scope.env = environment;
}]);