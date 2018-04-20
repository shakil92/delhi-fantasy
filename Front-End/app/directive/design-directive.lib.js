app.directive('customScroll', function () {
  return {
    restrict: 'A',
    scope: {
      config: '&customScroll'
    },
    link: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
            // create scroll elemnt
            var elem = iElement.mCustomScrollbar();
            // the live options object
            var mObject = elem.data('mCS_1');
           // $log.debug('elem: ', mObject.opt);
         }
       };
     });
app.directive('onePageScroll', ['$window',function ($window) {
      return {
        restrict: 'A',
        link: function(scope,element,attribute){
               scope.activeTabHome = 'home';
               scope.scrollTo = function(id){
                angular.element('html,body').animate({
                  scrollTop: angular.element('#'+id).offset().top - 60
                }, 1000);
                scope.activeTabHome = id;
               }
              }
           };
         }]);
app.directive('counter_num', function() {
  return {
    restrict: 'C',
    link: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
          // create scroll elemnt
          var elem = iElement.counterUp({
            delay: 10,
            time: 1500,
          });
        }
      };
    });
app.directive('animsition', function() {
  return {
    restrict: 'C',
    link: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
          // create scroll elemnt
          var elem = iElement.animsition({
            inClass: 'fade-in',
            outClass: 'fade-out',
            inDuration: 1500,
            outDuration: 800,
            linkElement: '.animsition-link',
            // e.g. linkElement: 'a:not([target="_blank"]):not([href^=#])'
            loading: true,
            loadingParentElement: 'body', //animsition wrapper element
            loadingClass: 'animsition-loading',
            loadingInner: '', // e.g '<img src="loading.svg" />'
            timeout: false,
            timeoutCountdown: 5000,
            onLoadEvent: true,
            browser: [ 'animation-duration', '-webkit-animation-duration'],
            // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
            // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
            overlay : false,
            overlayClass : 'animsition-overlay-slide',
            overlayParentElement : 'body',
            transition: function(url){ window.location.href = url; }
          });
        }
      };
    });  
app.directive('popupHandler', function() { 
  return { restrict: 'A', link: function($scope,element) {
   $scope.closePopup = function(id){ 
    if($('#'+id).find('.close').length>0) {
     $('#'+id).trigger('click');
   } else {
    $('#'+id).remove();
  }
  if($('.modal-backdrop').length>0) {
   $('.modal-backdrop').remove();
 } 
 $('body').removeClass('modal-open').css('padding-right',""); 
}; 
$scope.openPopup = function(id){  var popup = $('#'+id);
  $('#'+id).modal('show');
}; 
}, 
} 
});
app.directive('dropdownHandler', function(){   
  return{ restrict: 'A', link: function($scope,element) 
          {	
            $scope.handleDropDownMenu = function(e){
              var _that = $(e.target).closest('li');
              if(_that.find('i').length>0)
              {
                if(_that.find('i').first().hasClass('fa-angle-down'))
                {
                  _that.find('i').first().removeClass('fa-angle-down').addClass('fa-angle-up');
                }
                else
                {
                  _that.find('i').first().removeClass('fa-angle-down').addClass('fa-angle-up');
                } 
              }
              
              _that.find('.dropdown-menu').toggle();
            }
          }   
        }
  });
app.directive('justClick', function(){   
    return{ restrict: 'A', link: function($scope,element) 
            {	
              setTimeout(function(){
                var pwd = $(element).find('input[type=password]').focus();
               },2000);
            }   
          }
    }); 
app.directive('loading',   ['$http' ,function ($http)  
    {  
        return {  
            restrict: 'A',  
            template: '',  
            link: function (scope, elm, attrs)  
            {  
                scope.isLoading = function () {  
                    return $http.pendingRequests.length > 0;  
                };  
                scope.showLoader = function(){
                  elm.show();
                }
                scope.hideLoader = function(){
                  elm.hide();
                }
     
                scope.$watch(scope.isLoading, function (v)  
                {  
                    if(v){  
                        elm.show();  
                    }else{  
                        elm.hide();  
                    }  
                });  
            }  
        };  
    }])  
    app.directive('processHolder', function ()  
    {  
        return {  
            restrict: 'A',  
            template: '',  
            link: function (scope, elm, attrs)  
            {  
                scope.showLoaderBarrier = function(){
                  elm.show();
                }
                scope.hideLoaderBarrier = function(){
                  elm.hide();
                }
            }  
        };  
    })      
    app.directive('validNumber', function() {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return; 
          }
          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }           
            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
      var decimalCheck = clean.split('.');
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean =negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                  clean =negativeCheck[0];
                }               
            }             
            if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0,2);
                clean =decimalCheck[0] + '.' + decimalCheck[1];
            }
            if (val !== clean) {
              ngModelCtrl.$setViewValue(clean);
              ngModelCtrl.$render();
            }
            return clean;
          });
          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    }); 
    app.directive('datepickercustom',function(){
      return {
        restrict: 'E',
        'scope': {
          'dateSet': '@',
          'dateMinLimit': '@',
          'dateMaxLimit': '@',
          'dateMonthTitle': '@',
          'dateYearTitle': '@',
          'buttonNextTitle': '@',
          'buttonPrevTitle': '@',
          'dateDisabledDates': '@',
          'dateEnabledDates': '@',
          'dateDisabledWeekdays': '@',
          'dateSetHidden': '@',
          'dateTyper': '@',
          'dateWeekStartDay': '@',
          'datepickerAppendTo': '@',
          'datepickerToggle': '@',
          'datepickerClass': '@',
          'datepickerShow': '@',
          'dateFormat' :'@',
          'datepickerId':'@'
          },
        link: function(scope, element, attributes){
          /*Mobile Menu Handle*/
          element.find('#'+scope.datepickerId).datepicker({
            changeMonth: true,
            changeYear: true,
            maxDate: new Date(scope.dateMaxLimit),
            dateFormat: scope.dateFormat
            });
            
        }
      }	
      
    });

    app.directive('jqdatepicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
             link: function (scope, element, attrs, ngModelCtrl) {
                element.datepicker({
                    changeMonth: true,
                    changeYear: true,
                    maxDate: '0',
                    dateFormat: 'yy-mm-dd',
                    onSelect: function (date) {
                        let nameAttr = attrs.searchfield;
                        if(nameAttr === 'fromDate'){
                          scope.fromDate = date;
                        }else if(nameAttr === 'toDate'){
                          scope.toDate = date;
                        }
                        scope.$apply();
                    }
                });
            }
        };
    });
        