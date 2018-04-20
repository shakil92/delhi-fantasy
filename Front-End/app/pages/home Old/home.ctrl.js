'use strict';
app.directive('sliderHome',function(environment){
 return {
      restrict: 'E',
      controller: 'sliderCtrl',
      templateUrl: 'Front-End/app/pages/home/slider-home.html',
      link: function(scope,element,attribute){
        scope.env = environment;
        $(".banner-slider").slick({
          dots: true,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          arrows: false,
          centerMode: true,
       });
      }
 }
});
app.directive('timer',function(){
  return {
      restrict: 'A',
      link: function(scope,element,attribute){
        var countDownDate = new Date("Apr 7, 2018 24:00:00").getTime();
        
        // Update the count down every 1 second
            var x = setInterval(function () {
        
                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                $("#day").html(days);
                $("#hour").html(hours);
                $("#minute").html(minutes);
                $("#second").html(seconds);
        
                // Output the result in an element with id="demo"
                
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(x);
                }
                scope.$apply();
            }, 1000);
        
      }
    }
})

app.controller('sliderCtrl',['$scope','$rootScope','$location','environment',function($scope,$rootScope,$location,environment){
  $scope.env = environment;
}]);

app.controller('homeCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','environment',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,environment){
   $scope.env = environment; 
   if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
    {
      $location.url('/contest');
    }
    else
    {
       $scope.env = environment;
    }
  }]);