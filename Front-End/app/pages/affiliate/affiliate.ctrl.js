app.directive('sliderAffiliate',function(environment){
    return {
         restrict: 'E',
         controller: 'sliderAfCtrl',
         templateUrl: 'Front-End/app/pages/affiliate/affiliate-slider.html',
         link: function(scope,element,attribute){
           scope.env = environment;
           $(".affiliate_slider").slick({
             dots: true,
             infinite: true,
             slidesToShow: 1,
             slidesToScroll: 1,
             autoplay: true,
             autoplaySpeed: 2000,
             arrows: false,
           });
         }
    }
   });
app.controller('sliderAfCtrl',['$scope','$rootScope','$location','environment',function($scope,$rootScope,$location,environment){
    $scope.env = environment;
  }]);   
app.controller('affiliateCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$sessionStorage','environment','$stateParams',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$sessionStorage,environment,$stateParams){
    
        if($localStorage.hasOwnProperty('isLoggedIn'))
        {
            $scope.isLoggedIn = true;
        }
        else
        {
            $scope.isLoggedIn = false;
        }
        $scope.env = environment;
        $scope.contactForm = {};
        $scope.submitted = false;
        $scope.submitContact = function(form){
            $scope.submitted = true;
            if(!form.$valid)
            {
                return false;
            }
            var data = $scope.contactForm;
            appDB
            .callPostForm('user/affiliate_scheme',data) 
            .then(
                function success(data)
                { 
                    if(data.code == 200)
                    { 
                        if(data.status==1)
                        {
                           $scope.submitted = false;
                           $scope.success = true;
                           $scope.successmessage = data.message;
                           $scope.contactForm = {};
                           $timeout(function(){
                                $scope.success = false;
                                $scope.error = false;
                                $scope.successmessage = '';
                                $scope.errormessage = '';
                           }.bind($scope),3000);
                        }
                        else
                        {
                            $scope.submitted = false;
                            $scope.error = true;
                            $scope.errormessage = data.message;
                        }
                    } 
                },
                function error(data)
                { 
                    $scope.submitted = false;
                    $scope.error = true;
                    $scope.errormessage = data.message;
    
                }
                );
            
        }
    }]);