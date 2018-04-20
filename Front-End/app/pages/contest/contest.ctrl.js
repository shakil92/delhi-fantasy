'use strict';
app.directive('matchList',['$interval',function($interval){
 return {
  restrict: 'E',
  controller:'matchListCtrl',
  templateUrl:'Front-End/app/pages/contest/matchlist.html',
  link: function(scope, element, attributes){
   scope.applySlider = function(){
	if ($('.series_slider').length > 0) {
	  if(scope.isSetUp==true) {
		$('.series_slider').slick("slickRemove"); 
		$('.series_slider').slick("slickAdd");
		$('.series_slider').slick('unslick');
	  } else { 
		scope.isSetUp = true;
	  }
	  $('.series_slider').not('.slick-initialized').slick({
	  dots: false, 
	  infinite: false,
	  speed: 300,
	  slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: scope.initialSlide,
		responsive: [
			{
				breakpoint: 1500,
				settings: {
					slidesToShow:3,
				 
				}
			},
			{
				breakpoint: 481,
				settings: {
					slidesToShow:1,
				 
				}
			},
		
			{
				breakpoint:800,
				settings: {
					slidesToShow:2,
				 
				}
			},
			{
				breakpoint:1100,
				settings: {
					slidesToShow:3,
				 
				}
			}
		 
		]
	});

	}
	/*Timer Handler Starts Here*/
	$interval(function(){
	  var allClock = $('.slick-active');
	  for(var $i=0,len = allClock.length;$i<len;$i++)
		{ var _that = $(allClock[$i]).find('.timeCounter');
	  if(_that.length > 0 )
	  {
		var date = _that.attr('data-roundClockTime');
		var gape = scope.coreLogic.getTimeGap(date);
		if(gape=='-1')
		{
			_that.closest('.series_header').html('<span class="cloud_icon" href="javascript:void(0)"><span style="background-color:blue; color: #fff; padding: 2px 5px; border-radius:5px; font-size:13px; border: 1px solid blue;">Live</span></span><button class="join_btn">View</button>');
		}
		else
		{
			_that.html(gape);
		}
	  }  

	}
	var nextElement = $(allClock[allClock.length-1]).next();
	for(var $j=0;$j<3;$j++)
	  { if(nextElement.length>0)
		{
		  var _that = nextElement.find('.timeCounter');
		  if(_that.length > 0 )
		  {
			var date = _that.attr('data-roundClockTime');
			var gape = scope.coreLogic.getTimeGap(date);
			_that.html(gape);
		  }
		  nextElement = nextElement.next();
		}
		else
		{
		  break;
		}
	  }
	},1000);
	/*Timer Handler Ends Here*/
  }  
}
};
}]);

app.directive('createContest',function(){
 return {
  restrict: 'E',
  controller:'create_contestCtrl',
  templateUrl:'Front-End/app/pages/contest/create_contest.html',
  link: function(scope, element, attributes){
	scope.contest_size = 2;
	scope.closeContestPopup = function(){
	  scope.closePopup('creat_contest');
		scope.contestError = false;
		scope.calculation_error = false;
		scope.calculation_error_msg = false;
		delete scope.winnings;
		scope.number_of_winners = '';
		scope.total_winning_amount = '';
		scope.contest_sizes = 2;
		scope.submitted = false;
	  scope.clearPopup();
	}
	scope.isSetUp = false;
	scope.clearContent = function(){

	}
	scope.clearPopup = function(){
	  scope.contest_name = '';
	  scope.number_of_winners = '';
	  scope.is_multientry = false;
	  scope.winnings = false;
	  //scope.contest_sizes = 0;
	  scope.contest_sizes = 2;
	  scope.total_winning_amount = '';
	  scope.clearForm();
	  scope.submitted = false;
	}
  }
};
});

app.directive('isteamCreated',function(){
  return {
	restrict: 'E',
	controller:'create_contestCtrl',
	templateUrl:'Front-End/app/pages/contest/isTeamCreated.html',
	link: function(scope, element, attributes){
	}
  };
});
app.directive("preventTypingGreater", function() {
  return {
    link: function(scope, element, attributes) {
      var oldVal = null;
      element.on("keydown keyup", function(e) {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val(oldVal);
        } else {
          oldVal = Number(element.val());
        }
      });
    }
  };
});
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
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
app.controller('matchListCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB',function($scope,$rootScope,$location,$window,$localStorage,appDB){
	//$scope.AllGame = {};

	$scope.selectedMatchId="";
	$scope.fetchTeamNow = 0;
	
	if($rootScope.hasOwnProperty('currentSelectedMatch') && $rootScope.hasOwnProperty('currentSelectedMatchDetails')){
		
		$scope.seriesId=$rootScope.currentSelectedMatchDetails.seriesID;
		$scope.selectedMatchId = $rootScope.currentSelectedMatch;
		$scope.fetchMatch();
  		$scope.isClosed = false;
	}
	$scope.matches = [];  
	$scope.clearTeamFormation();

	$scope.changeCurrentMatch = function(id,isClosed,matchDetails){
		if($rootScope.hasOwnProperty('recordedAction') && $rootScope.recordedAction.action=='create-contest')
		{
			if($rootScope.recordedAction.lastPage=='create-team')
			{
				delete $rootScope.recordedAction.lastPage;
			}
			else
			{
				delete $rootScope.recordedAction;
			}
		}
	  $scope.currentSelectedMatch = id; // On Click change current Selected match
	  $scope.currentSelectedMatchDetails = {};
	  $scope.currentSelectedMatchDetails.seriesID = matchDetails.series_id;
	  $scope.currentSelectedMatchDetails.localteamID = matchDetails.localteam_id;
	  $scope.currentSelectedMatchDetails.visitorteamID = matchDetails.visitorteam_id;
	  $scope.currentSelectedMatchDetails.localteam = matchDetails.localteam;
		$scope.currentSelectedMatchDetails.visitorteam = matchDetails.visitorteam;
		$scope.currentSelectedMatchDetails.localTeamImg = matchDetails.localteam_image;
		$scope.currentSelectedMatchDetails.visitorTeamImg = matchDetails.visitorteam_image;

		$scope.currentSelectedMatchDetails.isOpenForUser = matchDetails.isOpenForUser;
	
	  var date = matchDetails.match_date+" "+matchDetails.match_time+":00";
	  var matchTime=matchDetails.match_time;
	  if (matchTime > '24' || matchTime=="TBA") {
		$scope.currentSelectedMatchDetails.dateTime=matchDetails.match_date+" "+"00:00";
	  }else{
		$scope.currentSelectedMatchDetails.dateTime = date;
	  }
	  $scope.isClosed = isClosed;
	  $scope.isTeamCreated = false;
	  $scope.currentSelectedTeam = null;
	  $scope.clearTeamFormation();
	  $scope.availablePlayer = [];
	  $scope.teamCount = 0;
	  $scope.teamsDetails = [];
	  $scope.contestFetch();
	  $scope.contestMineFetch();
		$scope.megaContestFetch();
		if($scope.isClosed==true)
		{
			$scope.resetTeamStructure();
			$scope.showTeamWithPoints=true;
		}
	}
   $scope.changeLeftContestWinnerPriceDisplay = function(index){
     $scope.contestLeftWinnerPrice[index] = !$scope.contestLeftWinnerPrice[index];
   }

	 $scope.changeBottomContestWinnerPriceDisplay = function(index){
		$scope.contestBottomWinnerPrice[index] = !$scope.contestBottomWinnerPrice[index];
	}
  $scope.plusHtml = '<i class="fa fa-plus" aria-hidden="true"></i>';
  $scope.minusHtml = '<i class="fa fa-minus" aria-hidden="true"></i>';
	
	$scope.showContestTeam = function(contest,teamsDetails,doProcess){
		if(doProcess)
		{
			var $data = {};
			/* Variable to Display Team*/
			if($scope.join_in_team.hasOwnProperty(contest.id))
			{
				$scope.join_in_team[contest.id] = [];
			}
			$data.login_session_key = $scope.userDetails.login_session_key;
			$data.user_id = $localStorage.userDetails.user_id;
			$data.match_id = $scope.currentSelectedMatch;
			$data.contest_id = contest.id;
			appDB.callPostForm('live/rank',$data) 
			.then(
			 function success(data)
			 { 
				 if(data.code == 200)
				 { 
					if(data.code == 200 && data.status == 1)
					{ 
						//Handle Success 
						if(data.response.length>0)
						{
							
							$scope.join_in_team[contest.id] = data.response;
						}
						else
						{
							$scope.join_in_team[contest.id] = [];
						}
						/*Send Message to Join Directive */
					} 
				} 
			},
			function error(data)
			{           
					if(typeof data!= undefined){
						$scope.join_in_team[contest.id] = [];
					}
					 
			}
		 );
		}
		else
		{
			if($scope.join_in_team.hasOwnProperty(contest.id))
			{
				delete $scope.join_in_team[contest.id];
			}
			return false;
		}
		
	}
}]);

app.controller('create_contestCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB','$compile',function($scope,$rootScope,$location,$window,$localStorage,appDB,$compile){
	 $scope.totalPercentage = 0; // For Contest Creation Belives total Percentage is 0
	 $scope.totalPersonCount = 0; // For Contest Creation Belives total Person count is 0
	 $scope.currentSelectedMatch = 0; //To maintain current Selected Match Id
	 /*------------calculate entryFee-------------------*/
	 $scope.adminPercent=10;
	 $scope.contest_sizes =2;
	   $scope.showSeries = true;
	   $scope.contestError = false;
	   $scope.contestErrorMsg = '';
  
	 /*Function to Fetch Matches*/
	 $scope.$watch('contest_sizes',function (newValue,oldValue) { 
	  $scope.number_of_winners = '';	  
	  if(newValue!=oldValue)
		{ if(typeof newValue=='undefined')
		  { 
			  $scope.team_entry_fee = 0.00;
			  return false;
		   }
			if(newValue>100)
			{
				$scope.contest_sizes = 100;
			}
			else if($scope.contest_sizes.match(/^0[0-9].*$/))
			{
				$scope.contest_sizes = $scope.contest_sizes.replace(/^0+/, '');
			}
		  
			
		if(parseInt($scope.contest_sizes)>0)
		{
			$scope.totalEntry = $scope.total_winning_amount / $scope.contest_sizes;
			$scope.team_entry_fee=($scope.totalEntry * $scope.adminPercent / 100 +$scope.totalEntry).toFixed(2);
		}
		else
		{
			$scope.team_entry_fee = 0;
		}
		
	  }
	});

	 $scope.$watch('total_winning_amount',function (newValue,oldValue) { 
	  if(newValue!=oldValue)
	  { 
			if(typeof newValue=='undefined')
			{
				$scope.team_entry_fee = 0.00;
				return false;
			}
			if(newValue>10000)
			{
				$scope.total_winning_amount = 10000;
			}
			if($scope.total_winning_amount.match(/^0[0-9].*$/))
			{
				$scope.total_winning_amount = $scope.total_winning_amount.replace(/^0+/, '');
			}
			if(parseInt($scope.contest_sizes)>0)
			{
				$scope.totalEntry = $scope.total_winning_amount / $scope.contest_sizes;
				$scope.team_entry_fee=($scope.totalEntry * $scope.adminPercent / 100 +$scope.totalEntry).toFixed(2);
			}
			else
			{
				$scope.team_entry_fee = 0;
			}
		$scope.clearForm(); 
	  }
	});

	 /*------------calculate Percent and Amount-------------------*/
	 $scope.choices = [];    
	 $scope.amount =0.00;

	 $scope.changePercent = function(x){
		 /*Remove Error First*/
		 $scope.calculation_error = false;
		 $scope.calculation_error_msg = '';
		 /*Remove Error First*/
		 if(x!=0 && x>0  )
		 {  let tempPersnCount1 = ($scope.choices[x].select_2-$scope.choices[x].select_1)+1;
			  let tempPersnCount0 = ($scope.choices[x-1].select_2-$scope.choices[x-1].select_1)+1;
				if((parseFloat(($scope.total_winning_amount*$scope.choices[x].percent)/100)/tempPersnCount1)>(parseFloat($scope.total_winning_amount*$scope.choices[x-1].percent/100)/tempPersnCount0))
			  {
					$scope.choices[x].percent='';
					$scope.choices[x].amount =  parseFloat(0);
		      return false;
		 		}
		}
	  let total = 0;
	  for (var i = 0; i < $scope.choices.length; i++) {
		total = total + parseFloat($scope.choices[i].percent);
	  }
	  if(total>100)
	  {
		$scope.choices[x].percent='';
		$scope.calculation_error = true;
		$scope.calculation_error_msg = 'Sum of percentage can not be more then 100%';
		$scope.choices[x].amount = parseFloat(0);
		return false;
	  }
	  
	  for (var i = 0; i < $scope.choices.length; i++) {
		if (i === x) {
		  let persenCount = 0;
		  if(parseInt($scope.choices[i].select_2)==parseInt($scope.choices[i].select_1))
		  {
			persenCount=1;
		  } 
		  else
		  {
			persenCount = ($scope.choices[i].select_2-$scope.choices[i].select_1)+1;
		  }
		  $scope.winnersAmount=$scope.total_winning_amount * $scope.choices[i].percent / 100 ;
			let amount = ($scope.winnersAmount / persenCount).toFixed(2);
			let fractionNumber = amount.split('.');
			amount = fractionNumber[0]+'.'+fractionNumber[1].slice(0,1);
			$scope.choices[i].amount = amount;
			if($scope.choices[i].percent.match(/^0[0-9].*$/))
			{
				$scope.total_winning_amount = $scope.total_winning_amount.replace(/^0+/, '');
			}
			$scope.choices[i].percent = $scope.choices[i].percent.replace(/^0+/, '');
		}
	  }
	}
	$scope.customizeMultieams = function(){
		$scope.calculation_error = false;
		$scope.calculation_error_msg = '';
	   if ($scope.contest_sizes== null || $scope.contest_sizes<3) {       
          $scope.calculation_error = true;
          $scope.calculation_error_msg ="Contest size must be greater then 2!";  
          $scope.is_multientry =false;
          return false;
       }
	}
	$scope.customizeWin= function () {
		$scope.calculation_error = false;
		$scope.calculation_error_msg = '';
		if($scope.winnings=="") 
        {
          $scope.showField =false;       
          $scope.number_of_winners = '';
          return false;
        }		 
        if($scope.total_winning_amount== null || $scope.total_winning_amount<1)
        {         
          $scope.calculation_error = true;
          $scope.calculation_error_msg = "Please enter total winning amount!";  
          $scope.winnings =false; 
          return false;
        }
        if ($scope.contest_sizes== null || $scope.contest_sizes<2) {       
          $scope.calculation_error = true;
          $scope.calculation_error_msg ="Contest size must be greater or equals to 2";  
          $scope.winnings =false;
          return false;
        }
    }
    $scope.changeWinAmount = function () {
			$scope.calculation_error = false;
			$scope.calculation_error_msg = '';
       if ($scope.total_winning_amount== null || $scope.total_winning_amount<1) {
          $scope.winnings =false;
        }
     }
    $scope.changeWinners= function () {
			$scope.is_multientry = false;
			$scope.calculation_error = false;
			$scope.calculation_error_msg = '';
      if ($scope.contest_sizes== null || $scope.contest_sizes<2) {
          $scope.winnings =false;
       }
      $scope.showField =false;
      $scope.contestError = false;
      $scope.clearForm();
    }
   /*---------------add and remove Field-------------------*/
   $scope.select_1=1;     
   var x=0;
   $scope.choices.push({row:x,select_1:1,select_2:1,amount:0.00,percent:0});
   $scope.addField = function() {
	 x=x+1;
	 $scope.numbers1=[];

	 var select2_value="";
	 $scope.percent_error = false;
	 var lastIndex = $scope.choices.length-1;
	 if($scope.choices[lastIndex].percent==0)
	 {
	  $scope.calculation_error = true;
      $scope.calculation_error_msg ="Last percentage is blank!"; 
	  return false;
	}
	if($scope.totalPercentage==100)
	{
	  $scope.calculation_error = true;
      $scope.calculation_error_msg ="Amount has been distributed already!";
	  return false;
	}
	for(var k=0;$scope.choices.length>k;k++)
	{

	  if(k==$scope.choices.length-1)
	  {
		if ( $scope.choices[k].percent) 
		{
		  select2_value=($scope.choices[k].select_2+1);
		  for(var j=($scope.choices[k].select_2+1);j<=parseInt($scope.number_of_winners);j++)
		  {
			$scope.numbers1.push(j)
		  }
		}
		else{
		 $scope.percent_error=true;
		 return false;
	   }
	 }
   }
   if (select2_value<=parseInt($scope.number_of_winners)) {
	 $scope.choices.push({row:x,select_1:select2_value,select_2:select2_value,numbers:$scope.numbers1,percent:0,amount:0.00});
   }
   else{
	 $scope.calculation_error = true;
   $scope.calculation_error_msg ="All Winners has been selected already!";
  }     

}
$scope.$watch('choices',function(n,o,scope){
  var totalPercentagetemp = 0;
  var isRemoval = false;
  var removalIndex = 0;
  /*Code to track Changes in top rows and if any remove below rows*/
  if($scope.choices.length>1)
  {
	for(var counter=0;counter<$scope.choices.length;counter++)
	{
	  if(counter<o.length-1 && (o[counter].amount!=n[counter].amount || o[counter].select_2!=o[counter].select_2))
	  {
		isRemoval = true;
		removalIndex = counter+1;
	  }
	}
  }
  if(isRemoval==true)
  {
	var numberOfRows = $scope.choices.length;
	if(removalIndex<=numberOfRows-1)
	{
	  var removeElementCount = numberOfRows-removalIndex;
	  $scope.choices.splice(removalIndex,removeElementCount);
	}

  }
  /*Code to track Changes in top rows and if any remove below rows*/

  /*Total Percentage Count and Handler*/
  for(var counter=0;counter<$scope.choices.length;counter++)
  {
	totalPercentagetemp += parseFloat($scope.choices[counter].percent);
  }
  if(totalPercentagetemp>100)
  {
	$scope.choices = o;
	return false;
  }
  $scope.totalPercentage = totalPercentagetemp;
  /*Total Percentage count and handler*/

  /*Total Person count and Handler*/
  let personCount = 0;
  for (var i = 0; i < $scope.choices.length; i++) {
	if($scope.choices[i].select_1==$scope.choices[i].select_2)
	{
	  personCount++;
	}
	else
	{
	  personCount += parseInt(($scope.choices[i].select_2-$scope.choices[i].select_1)+1);
	}
  }
  $scope.totalPersonCount = personCount;
  /*Total Person Count and Handler*/
},true);

/*Handle Contest Size*/
$scope.$watch('number_of_winners',function(newValue,oldValue){
  if(parseInt(newValue)>parseInt($scope.contest_sizes))
  {
	$scope.number_of_winners = oldValue;
  }
});



$scope.removeField = function(index) {
	if(index==0)
	{
		$scope.calculation_error = true;
		$scope.calculation_error_msg = "You can not remove first row."; 
	  return false;
	}
	if(index<$scope.choices.length-1)
	{
		$scope.calculation_error = true;
		$scope.calculation_error_msg = "While having row beneath you can not delete current row."; 
	  return false;
	}
	if(index >= 0){
	 $scope.choices.splice(index, 1);
	 $scope.calculation_error = false;
	 $scope.calculation_error_msg = '';
 }
}



/*------------ show  and hide form-------------------*/  
$scope.showField = false;
$scope.numbers=[];
$scope.Showform = function () { 
	if($scope.number_of_winners=='' || $scope.number_of_winners=='0')
	{
		$scope.calculation_error = true;
		$scope.calculation_error_msg = "Please enter proper winner count!"; 
	  return false;
	}

 if($scope.number_of_winners && $scope.contest_sizes)
 { 
  if ($scope.numbers=='') {
	for(var i=1;i<=parseInt($scope.number_of_winners);i++){
	  $scope.numbers.push(i);
	}
  }
  else{
   for(var i=1;i<=parseInt($scope.number_of_winners);i++){
	 $scope.numbers.push(i) 
	 $scope.numbers.splice(i);
   }
 }
 $scope.choices[0].numbers=  $scope.numbers;          
 if (parseInt($scope.contest_sizes) >= parseInt($scope.number_of_winners)) 
 {
  $scope.error = false;
  $scope.showField =true;
}
else 
{
  $scope.error=true;
  $scope.showField =false;
  return false;
} 
}
else
{
  $scope.error=true;
	$scope.showField =false;
	$scope.calculation_error = true;
	$scope.calculation_error_msg = "Please enter proper winner count!"; 
  return false;
}
}

$scope.createContest = function(form){
      // $scope.helpers = Mobiweb.helpers;
      $scope.contestError = false;	      
      $scope.submitted = true;
     
			if($scope.hasOwnProperty('winnings') && $scope.winnings==true && ($scope.number_of_winners=="" || $scope.number_of_winners=="0"))
      {
				$scope.calculation_error = true;
				$scope.calculation_error_msg ="Winner size can not be less then 1 in customize winning!";
			 	return false;
      }
			if($scope.hasOwnProperty('winnings') && $scope.winnings==true && parseInt($scope.contest_sizes)<parseInt($scope.number_of_winners ))
      {
				$scope.calculation_error = true;
				$scope.calculation_error_msg ="Winner size can not be more then contest size!";
			 	return false;
      }
      if($scope.winnings==true && $scope.totalPersonCount!=$scope.numbers.length)
      {
         $scope.calculation_error = true;
         $scope.calculation_error_msg ="Price amount has not been decided for all winners!";
        return false;
      }
      if ($scope.contest_sizes== null || $scope.contest_sizes<2) {
          $scope.calculation_error = true;
          $scope.calculation_error_msg ="Contest size at least 2 !";  
          return false;
        }
      if($scope.winnings==true && $scope.totalPercentage!=100)
      {
        $scope.calculation_error = true;
        $scope.calculation_error_msg ="Prize amount is not distributed fully!";
        return false;
      }
			if(!form.$valid)
      {
        return false;
			}
			if($scope.calculation_error==true)
			{
				return false;
			}
			let $data = {};
      $data.login_session_key = $scope.userDetails.login_session_key;
      $data.user_id = $localStorage.userDetails.user_id;
      $data.match_id = $scope.currentSelectedMatch;
      $data.total_winning_amount = $scope.total_winning_amount;
      $data.contest_sizes = $scope.contest_sizes;
      $data.team_entry_fee = $scope.team_entry_fee;
      $data.number_of_winners = $scope.number_of_winners;
      $data.contest_name = $scope.contest_name;
			$data.is_multientry = 0;
			if($scope.hasOwnProperty('winnings') && $scope.winnings==true)
			{
				$data.custom_winning = 1;
			}
			else{
				$data.custom_winning = 0;
			}
      if($scope.hasOwnProperty('is_multientry') && $scope.is_multientry==true)
      {
        $data.is_multientry = 1;
      }
      $data.winning_rank = JSON.stringify($scope.contestPrizeParser($scope.choices));
      
      appDB.callPostForm('contest/create_contest',$data) 
      .then(
       function success(data)
       { 
         if(data.code == 200)
         { 
          if(data.code == 200 && data.status == 1)
          { 
            //Handle Success 
            $scope.closeContestPopup();   
            $scope.contestFetch();
						if(typeof data.response=='object')
						{
							if(data.response.hasOwnProperty('user_invite_code'))
							{
								$rootScope.self_contest = {'invite_code':data.response.user_invite_code,'contest_id':data.response.id};
								$scope.clearPopup();
							}
							$rootScope.recentCreatedSelfContest = true;
							/*Send Message to Join Directive */
							$rootScope.$broadcast('current_contest_emit',data.response,'1');
							$rootScope.$broadcast('action_record','self-contest-join',data.response);
						}
						else
						{
							if(data.response[0].hasOwnProperty('user_invite_code'))
							{
								$rootScope.self_contest = {'invite_code':data.response[0].user_invite_code,'contest_id':data.response[0].id};
								$scope.clearPopup();
							}
							$rootScope.recentCreatedSelfContest = true;
							/*Send Message to Join Directive */
							$rootScope.$broadcast('current_contest_emit',data.response[0],'1');
							$rootScope.$broadcast('action_record','self-contest-join',data.response[0]);
						}
						
          } 
        } 
      },
      function error(data)
      {           
					if(typeof data!= undefined){
						$scope.contestError = true;
						$scope.contestErrorMsg= data.message;
					}
					 
      }
         );

    };
    $scope.contestPrizeParser = function($choices)
    { let response = {};
    for(var $i=0;$i<$scope.choices.length;$i++)
    {
      let valueArray = [];
      valueArray.push($scope.choices[$i].select_1);
      valueArray.push($scope.choices[$i].select_2);
      valueArray.push($scope.choices[$i].percent);
      valueArray.push($scope.choices[$i].amount);
      response[$i+1] = valueArray;
    }
    return response;
}

  $scope.clearForm = function(){
	$scope.showField = false;
	$scope.choices =[];
	$scope.choices.push({row:0,select_1:1,select_2:1,amount:0.00,percent:0});

	if($scope.number_of_winners && $scope.contest_sizes)
	{ 
	 if ($scope.numbers=='') 
	 {
	   for(var i=1;i<=parseInt($scope.number_of_winners);i++){
		 $scope.numbers.push(i);
	   }
	 }
	 else
	 {
	  for(var i=1;i<=parseInt($scope.number_of_winners);i++){
		$scope.numbers.push(i) 
		$scope.numbers.splice(i);
	  }
	}
  }
}
/*Code for contest list Down*/



}]);
app.controller('contestCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$sessionStorage','environment','$timeout',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$sessionStorage,environment,$timeout){

  if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
  {

  	$scope.activeTab = '1';
  	
  	$scope.gotopublicTab = function(tab){
  		$scope.activeTab = tab;
  	}

    $scope.coreLogic = Mobiweb.helpers;
    $scope.isClosed = 'true'; //considering selected match is closed.
		$scope.totalBalance=$localStorage.totalBalance;
		$scope.chipBalance = $localStorage.chipBalance;
    $scope.userDetails = $localStorage.userDetails;
    $scope.alert_title = '';
	  $scope.alert_message = '';
		$scope.env = environment;
		$scope.join_in_team = {};
		/*To Handle Weird Design*/
		$scope.leftContestContainer = [];
		$scope.bottomContestContainer = [];
		/*To Handle Groud Pattern Design */
		$scope.initialSlide = 0;
		$scope.teamStructure={
			"WICKETKEEPER":{"min":1, "max":1, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'gloves.png'},
			"BATSMAN":{"min":3, "max":5, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'bat.png'},
			"BOWLER":{"min":3, "max":5, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'ball.png'},
			"ALLROUNDER":{"min":1, "max":3, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'bat_ball.png'},
			"EXTRA":{"min":3,"max":3,occupied:0,player:[]},
			"ready":false
		};
		
		$scope.resetTeamStructure = function(){
			$scope.teamStructure={
				"WICKETKEEPER":{"min":1, "max":1, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'gloves.png'},
				"BATSMAN":{"min":3, "max":5, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'bat.png'},
				"BOWLER":{"min":3, "max":5, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'ball.png'},
				"ALLROUNDER":{"min":1, "max":3, "occupied":0,player:[],"imgURL":$scope.env.image_base_url+'bat_ball.png'},
				"EXTRA":{"min":3,"max":3,occupied:0,player:[]},
				"ready":false
			};
		}
	/*Handle Logic to Show players on Ground if found team */
		$scope.handleTeamSelection = function(){
			$scope.resetTeamStructure();
			if($scope.availablePlayer.hasOwnProperty('players') && $scope.availablePlayer.players.length>0)
				{
					angular.forEach($scope.availablePlayer.players,function(value,index){
						$scope.setTeamOnGround(value,value.play_role);
					});
				}
			}
			$scope.setTeamOnGround = function(detail,position){
				if($scope.teamStructure[position].player.length==$scope.teamStructure[position].min)
				{
						$scope.teamStructure.EXTRA.player.push(detail);
						$scope.teamStructure.EXTRA.occupied++;
				}
				else
				{
					$scope.teamStructure[position].player.push(detail);
				}
			}
		$scope.processNow = function(x,y){
			if(typeof $scope[x]==='function'){
				$scope[x](y);
			}
			else
			{
				console.log('--Something went wrong---');
			}
		}
		if($rootScope.hasOwnProperty('currentSelectedMatchDetails') && !$scope.hasOwnProperty('currentSelectedSeries'))
		{
			$scope.currentSelectedSeries = $rootScope.currentSelectedMatchDetails.seriesID;
			if($scope.hasOwnProperty('fetchMatch'))
			{
				$scope.fetchMatch();
			}
		}
		else if(!$scope.hasOwnProperty('currentSelectedSeries')){
			$scope.currentSelectedSeries = false;
		}
		/*Handler Series*/
		if ($localStorage.userDetails!=undefined) {
			var $data = {};
			$data.login_session_key = $localStorage.userDetails.login_session_key;   
		}
		$scope.getAllSeries = function(){

			/* Manage first time login pop-up */
			$scope.series = [];
			appDB
			.callPostForm('match/series',$data) 
			.then(
				function success(data){ 
					if(data.code == 200 && data.status == 1){ 
						$scope.series=data.response;
						$scope.seriesErrMsg="";
					} 
				},
				function error(data){
					if (data!=null) {					
						$scope.seriesErrMsg=data.message;
					}
				}
				);
		}
		$scope.getAllSeries();

		$scope.skipClaim = function(){
			$localStorage.isFirstLoginSkip = 1;
			$('#first_login').modal('hide');
		}

		$scope.completeProfile = function(){
			$localStorage.isFirstLoginSkip = 1;
			$localStorage.isFirstProfile = 0;
			$('#first_login').modal('hide');
			$('#edit_profile').modal('show');	
			if(!$localStorage.userDetails.date_of_birth)
			{
				$scope.users.date_of_birth = '';
			}
			setTimeout(function(){
				$('body').addClass('modal-open');
			},500);
		}

		$scope.manageFirstLogin  = function(){
			let is_first_login   = (!$localStorage.userDetails.is_first_login) ? 0 : parseInt($localStorage.userDetails.is_first_login);
			let isFirstLoginSkip = (!$localStorage.isFirstLoginSkip) ? 0 : parseInt($localStorage.isFirstLoginSkip); 
			if(is_first_login === 1 && isFirstLoginSkip === 0)
			{
				//$('#first_login').modal('show');
			}
		}
		$scope.manageFirstLogin();

		if($scope.currentSelectedSeries!=false)
		{
			$scope.seriesId = $scope.currentSelectedSeries;
		}
		/*Get all list of series ends*/
		
		/*Get match by a series starts*/
		$scope.changeSeries = function(id){
			if($scope.hasOwnProperty('teamsDetails')){
				$scope.clearTeamFormation();
			}
			delete $rootScope.currentSelectedMatch;
			delete $rootScope.currentSelectedMatchDetails;
			$scope.currentSelectedSeries = id;
			$scope.isInitialSet = false;
		}
    /*Create Team Page Redirection*/
    $scope.createTeam = function(action){
      $scope.closePopup("check_team");
      $rootScope.currentSelectedMatch = $scope.currentSelectedMatch;
      $rootScope.currentSelectedMatchDetails = $scope.currentSelectedMatchDetails;
      $location.url('/team');
    }
    $scope.checkTeam = function(){
      $rootScope.$broadcast('action_record','create-contest',{});
      $scope.openPopup("check_team");
    }

    /*Fetch Match*/
    $scope.fetchMatch = function(){
			var $data = {};
			$data.login_session_key = $localStorage.userDetails.login_session_key; 
			$scope.isInitialSet = false;  
			/*Removing Recorded Action for Create-contest only*/
			if($rootScope.hasOwnProperty('recordedAction') && $rootScope.recordedAction.action=='create-contest')
			{
				if($rootScope.recordedAction.lastPage=='create-team')
				{
					delete $rootScope.recordedAction.lastPage;
				}
				else
				{
					delete $rootScope.recordedAction;
				}
			}
			/*Removing Recorded Action*/
			if($scope.currentSelectedSeries!=false)
      {
        $data.series_id = $scope.currentSelectedSeries;
      }else if($scope.seriesId!=undefined){
       $data.series_id=$scope.seriesId;
     }else{
			 $data.series_id = '';
		 }
		 $scope.join_in_team = {};
     appDB
     .callPostForm('match/matches',$data) 
     .then(
      function success(data)
      {  
        if(data.code == 200)
        { 
          if(data.code == 200 && data.status == 1)
          { 
              //Handle Success 
              $scope.matches = [];
              $scope.matches = data.response; 
              /*Change Match Time to Locale Time*/
              let detailHolder = -1;
							$scope.initialSlide = 0;
							for(var $i=0,len=$scope.matches.length;$i<len;++$i)
              { 
                var localeDateTime = $scope.coreLogic.getLocalDateTime($scope.matches[$i].match_date,$scope.matches[$i].match_time);
                $scope.matches[$i].match_date = localeDateTime.getFullYear()+"-"+(localeDateTime.getMonth()+1)+"-"+localeDateTime.getDate();
                $scope.matches[$i].match_time = ('0'+localeDateTime.getHours().toString()).slice(-2)+":"+('0'+localeDateTime.getMinutes().toString()).slice(-2);
                if($scope.selectedMatchId!="" && $scope.selectedMatchId==$scope.matches[$i].match_id)
                {
									detailHolder = $i;
									$scope.initialSlide = $i;
									$scope.isInitialSet = true;
                }
							}
					  $scope.endTimeHandler(); //Functionality for maintain End Time and If Contest is closed
            /*Handle Current Selected Match, IsClosed && Current Selected Match Details*/
						if(detailHolder==-1)
						{
							detailHolder = $scope.initialSlide;
						}
						$scope.currentSelectedMatch = $scope.matches[detailHolder].match_id; //Set First Match By Default as selected
						$scope.isClosed = $scope.matches[detailHolder].isClosed;
						
            $scope.currentSelectedMatchDetails = {};
            $scope.currentSelectedMatchDetails.seriesID = $scope.matches[detailHolder].series_id;
            $scope.currentSelectedMatchDetails.localteamID = $scope.matches[detailHolder].localteam_id;
            $scope.currentSelectedMatchDetails.localteam = $scope.matches[detailHolder].localteam;
            $scope.currentSelectedMatchDetails.visitorteam = $scope.matches[detailHolder].visitorteam;
            $scope.currentSelectedMatchDetails.visitorteamID = $scope.matches[detailHolder].visitorteam_id;
            $scope.currentSelectedMatchDetails.dateTime = $scope.matches[detailHolder].match_date+" "+$scope.matches[detailHolder].match_time+":00";
            $scope.currentSelectedMatchDetails.isOpenForUser = $scope.matches[detailHolder].isOpenForUser;
						$scope.currentSelectedMatchDetails.localTeamImg = $scope.matches[detailHolder].localteam_image;
						$scope.currentSelectedMatchDetails.visitorTeamImg = $scope.matches[detailHolder].visitorteam_image;
						var date = $scope.matches[detailHolder].match_date+" "+$scope.matches[detailHolder].match_time+":00";
            var matchTime=$scope.matches[detailHolder].match_time;
            if (matchTime > '24' || matchTime=="TBA") {
              $scope.currentSelectedMatchDetails.dateTime=$scope.matches[detailHolder].match_date+" "+"00:00";
            }else{
              $scope.currentSelectedMatchDetails.dateTime = date;
            }

						$scope.contestLeftWinnerPrice = [];
						$scope.contestBottomWinnerPrice = [];
            $scope.contestFetch();
            $scope.contestMineFetch();
            $scope.megaContestFetch();
            setTimeout(function(){
                $scope.applySlider();

              },50);                     
            } 
          } 
          $scope.fetchTeamNow++;
        },
        function error(data)
        { 
          $scope.matches =[];
          console.log('---Seems Hacking Attack---');
          $scope.fetchTeamNow++;
        }
        );
   }

   $scope.$watch('currentSelectedSeries',function(newValue,oldValue){
	if(typeof newValue!= undefined && (newValue!=oldValue || newValue==false) )
	{
	  $scope.fetchMatch();
	}
  });

   /*Tabs Handler*/
   $scope.tabs = {contest:{active:'public'}};
   $scope.tabChange = function(type,active)
   {
		$scope.tabs[type]['active'] = active;
		if($scope.isClosed==true)
		{
		 $scope.resetTeamStructure();
		 $scope.showTeamWithPoints=true;
		}
  }
  /*Tabs Handler End Here*/

  /*Contest Fetch */
  $scope.currentContestList = {};
  $scope.currentMyContestList = {};
  $scope.megaContest = {};
  $scope.hasMegaContest = false;

  $scope.contestFetch = function(){
	let $data = {};
	$data.user_id = $scope.userDetails.user_id;
	$data.login_session_key = $scope.userDetails.login_session_key;
	$data.match_id = $scope.currentSelectedMatch;
	$scope.defaultOption();
	appDB.callPostForm('contest/contests',$data) 
	.then(
	 function success(data){ 
		console.log('data',data);
		$scope.leftContestContainer = [];
		$scope.bottomContestContainer = [];
		if(data.code == 200)
	   { 
		if(data.code == 200 && data.status == 1)
		{ 
		  //Handle Success 
		  $scope.currentContestList = data.response;
		  $scope.allContMsg="";
			$scope.contestErr="";
		
			$scope.leftContestAssigner();
			$scope.bottomContestAssigner();
		} 
		
	  } 
	},
	function error(data)
	{ 
		$scope.leftContestContainer = [];
		$scope.bottomContestContainer = [];

		if(typeof data!= undefined)
		{
			$scope.currentContestList = [];
			if (data.status == 0) {
				$scope.allContMsg="There is no contest for this match!";
				$scope.contestErr="";
			}
		}
   }
  );
  } 
	/*TO handle Weird Contest Design*/
	$scope.leftContestAssigner = function(){
		$scope.leftContestContainer = [];
		if($scope.currentContestList.length>0)
		{
			let limit = 6;
			if(limit>$scope.currentContestList.length)
			{
				limit = $scope.currentContestList.length;
			}
			for(var $c=0;$c<limit;$c++)
			{
				$scope.leftContestContainer.push($scope.currentContestList[$c]);
				$scope.contestLeftWinnerPrice.push(false);
			}
		}
		else
		{
			$scope.leftContestContainer = [];
		}
	}
	$scope.bottomContestAssigner = function(){
		$scope.bottomContestContainer = [];
		if($scope.currentContestList.length>6)
		{
			let limit = 6;
			if(limit>$scope.currentContestList.length)
			{
				limit = $scope.currentContestList.length;
			}
			for(var $c=limit,$len = $scope.currentContestList.length;$c<$len;$c++)
			{
				$scope.bottomContestContainer.push($scope.currentContestList[$c]);
				$scope.contestBottomWinnerPrice.push(false);
			}
		}
		else
		{
			$scope.bottomContestContainer = [];
		}
	}
	
	$scope.contestMineFetch = function(type){
	let $data = {};
	$data.user_id = $scope.userDetails.user_id;
	$data.login_session_key = $scope.userDetails.login_session_key;
	$data.match_id = $scope.currentSelectedMatch;
	$data.type = (!type) ? 'FIXTURE' : type;
	$('ul.my-contest-sub-tabs li').removeClass('active');
	$('ul.my-contest-sub-tabs li.'+$data.type).addClass('active');
	// appDB.callPostForm('contest/my_joined_contests',$data) 
	appDB.callPostForm('contest/my_joined_contests_app',$data) 
	.then(
	 function success(data)
	 { 
	   if(data.code == 200)
	   { 
		if(data.code == 200 && data.status == 1)
		{ 
		  //Handle Success 
		  $scope.currentMyContestList = data.response;
		  $scope.myContestErr="";
		} 
	  } 
	},
	function error(data)
	{ 
	 	if(typeof data!= undefined && data.status == 0){ 
	  		$scope.currentMyContestList = [];
	  		$scope.myContestErr=data.message;
		}
  	}
  );
  } 
  /*Handle MegaContest*/
  $scope.megaContestFetch = function(){
	let $data = {};
	$data.user_id = $scope.userDetails.user_id;
	$data.login_session_key = $scope.userDetails.login_session_key;
	$data.match_id = $scope.currentSelectedMatch;
	appDB.callPostForm('contest/mega_contests',$data) 
	.then(
	 function success(data)
	 { 
	   if(data.code == 200)
	   { 
		if(data.code == 200 && data.status == 1)
		{ 
		  //Handle Success 
		  $scope.megaContest = data.response;
		  $scope.hasMegaContest = true;
		 

		 }
		 else
		 {
			 $scope.hasMegaContest = false;
		 } 
	 } 
	 if($scope.isClosed==false)
	 {
		$scope.setUserTeam();
	 }
	 else
	 {
		 $scope.teamCount = 0;
	 }
	
   },
   function error(data)
   { 
			if(typeof data!= undefined)
			{
				$scope.megaContest = {};
				$scope.hasMegaContest = false;
	 			$scope.setUserTeam();
			}	
  }
  );
  }
  /*Handle MegaContest Ends Here*/
  $scope.endTimeHandler = function(isDigest){
	var $matches = $scope.matches;
	if($matches.length>0)
	{
	  for(var $i=0;$i<$matches.length;$i++)
	  {
		var matchTime=$scope.matches[$i].match_time;
		var date = $scope.matches[$i].match_date+" "+$scope.matches[$i].match_time+":00";
		let gap = $scope.coreLogic.getTimeGap(date);
		if(gap==-1)
		{
		  $scope.matches[$i].isClosed = true; //Past Date
		}
		else if(gap==0)
		{
		  $scope.matches[$i].isOpenForUser = false; //Not Open For User
		  $scope.matches[$i].isClosed = false;
		}
		else
		{
		  $scope.matches[$i].isClosed = false; //Not Past Date & Open For User as well
			$scope.matches[$i].isOpenForUser = true;
			if($scope.initialSlide==0 && $scope.isInitialSet == false)
			{
				$scope.initialSlide = $i;
				$scope.isInitialSet = true;
			}
		}
		
		if(gap==-1 && $scope.matches[$i].status=='open')
		{
			$scope.matches[$i].isLive = true;
		}
		else
		{
			$scope.matches[$i].isLive = false;
		}

		if($scope.matches[$i].isContest=='NO')
		{
			$scope.matches[$i].isOpenForUser = false;
		}

		if($i==0)
		{
		  $scope.isClosed = $scope.matches[$i].isClosed;
		}
		if (matchTime > '24' || matchTime=="TBA") {
		  $scope.matches[$i].gameDate=$scope.matches[$i].match_date+" "+"00:00";
		}
		else{
		  $scope.matches[$i].gameDate = date;

		}
	  }
	} 
  }
	$scope.showlineupwithScore = function(team_id)
	{ $scope.teamCount =0;
		$data.user_team_id = team_id;
		$data.login_session_key = $scope.userDetails.login_session_key;
		$data.match_id = $scope.currentSelectedMatch;
		appDB.callPostForm('match/players_score',$data) 
		.then(
		 function success(data)
		 { 
					if(data.code == 200)
					{ 
						if(data.code == 200 && data.status == 1)
						{ 
								$scope.teamCount=1;
								$scope.isTeamCreated = true;
								$scope.teamsDetails = data.response;
								$rootScope.joinTeamsDetails = $scope.teamsDetails
								$scope.availablePlayer = $scope.teamsDetails;
								$scope.showTeamWithPoints = true;
								$scope.handleTeamSelection();
						}
						else
						{
							$scope.showTeamWithPoints = false;
						} 
					} 	
				},
				function error(data){
					$scope.showTeamWithPoints = true;
				});
	}
  /*Filter for contest list starts*/
  $scope.contestFilter = function(selectedWin,selectedPay,selectedSize){      
	let $data = {};
	$scope.selectedWin=selectedWin;
	$scope.selectedPay=selectedPay;
	$scope.selectedSize=selectedSize;
	$data.user_id = $scope.userDetails.user_id;
	$data.login_session_key = $scope.userDetails.login_session_key;
	$data.match_id = $scope.currentSelectedMatch;
	$data.win=$scope.selectedWin;
	$data.pay=$scope.selectedPay;
	$data.size=$scope.selectedSize; 
	appDB.callPostForm('contest/contests',$data) 
	.then(
	  function success(data){ 
		if(data.code == 200 && data.status == 1){ 
			$scope.currentContestList=data.response;
			$scope.leftContestAssigner();
			$scope.bottomContestAssigner();
		  $scope.contestErr="";
		  $scope.allContMsg="";
		} 
	  },
	  function error(data){ 
		if (typeof data!= undefined && data.status==0) {
		  $scope.contestErr="No matches found!";
		  $scope.allContMsg="";
			$scope.currentContestList=[];
			$scope.leftContestContainer = [];
			$scope.bottomContestContainer = [];
		}
	  });
  }
  /*Filter for contest list ends*/
  $scope.defaultOption = function() {
	$scope.selectedWin='all';
	$scope.selectedPay='all';
	$scope.selectedSize='all';
  }
  /*Filter for user team */

	if($sessionStorage.hasOwnProperty('userTeamCount'))
	{
		delete $sessionStorage.userTeamCount;
	}
	$scope.setUserTeam = function(){
	
   let $data = {};
   $data.user_id = $scope.userDetails.user_id;
   $data.login_session_key = $scope.userDetails.login_session_key;
   $data.match_id = $scope.currentSelectedMatch;

   appDB.callPostForm('match/user_team_list',$data) 
   .then(
	 function success(data){ 
	   if(data.code == 200 && data.status == 1){ 
		$scope.isTeamCreated = true;
		$scope.teamsDetails = data.response;
		$rootScope.joinTeamsDetails = $scope.teamsDetails
		$scope.teamCount = $scope.teamsDetails.length;
	   
		if($rootScope.hasOwnProperty('latestTeamCreated')){
			$scope.availablePlayer = $scope.teamsDetails [$scope.teamsDetails.length - 1];
			$scope.handleTeamSelection();
		  $scope.latestTeam=$rootScope.latestTeamCreated;
		  $scope.teamsDetails.currentSelectedTeam=  $scope.availablePlayer.user_team_id;
		}else{
		  $scope.availablePlayer = $scope.teamsDetails[0];
			$scope.handleTeamSelection();
			$scope.teamsDetails.currentSelectedTeam = $scope.teamsDetails[0].user_team_id;
		}
		$scope.$broadcast("setTeamCount", $scope.teamCount,$scope.teamsDetails.currentSelectedTeam);
		$sessionStorage.userTeamCount = $scope.teamCount;
		$scope.$broadcast("getTeamDetails",$scope.teamsDetails);
		 /*Rejoin Popup Handling*/
		if($rootScope.hasOwnProperty('rejoinRecordedAction'))
    	{
    		$scope.rejoinPopUpFlow();
        }
        if($rootScope.hasOwnProperty('currentSelectedContest') && $rootScope.hasOwnProperty('join_type') && $rootScope.join_type == 'rejoin'){
	        $scope.rejoinPopup($rootScope.currentSelectedContest);
	        delete $rootScope.currentSelectedContest;
	    }
	  } 
	},
	function error(data){ 
	 if (typeof data!= undefined && data.status==0) {
	  $scope.teamCount = 0;
	  $scope.$broadcast("setTeamCount", $scope.teamCount,0);
	}
  });
 }
 
 $scope.teamChange = function(){
	for(var $teamI=0,$teamL=$scope.teamsDetails.length;$teamI<$teamL;$teamI++){
	if($scope.teamsDetails[$teamI].user_team_id==$scope.teamsDetails.currentSelectedTeam){
		$scope.availablePlayer = $scope.teamsDetails[$teamI];
		$scope.handleTeamSelection();
	}
  }
}
$scope.clearTeamFormation = function(){
  $scope.teamsDetails = [];
	$scope.availablePlayer = [];
	$scope.resetTeamStructure();
  $scope.playerListDefault = [{playerSeat:11},{playerSeat:10},{playerSeat:9},{playerSeat:8},{playerSeat:7},{playerSeat:6},{playerSeat:5},{playerSeat:4},{playerSeat:3},{playerSeat:2},{playerSeat:1}];
}

$scope.addteamtocontest = {};
$scope.RejoinTeamToContest = function(){
var $data={};
$data.login_session_key     = $localStorage.userDetails.login_session_key; 
$data.user_id               = $localStorage.userDetails.user_id;
$data.contest_id            = $scope.current_contest.id;
$data.joining_amount        = $scope.current_contest.team_entry_fee;
$data.user_team_id          = $scope.addteamtocontest.selectedTeamForJoincontest;
$data.match_id              = $scope.currentSelectedMatch;
$data.chip  = '0';
if($scope.current_contest.hasOwnProperty('joining'))
{
		$data.joining_amount = $scope.current_contest.joining.cash;
		$data.chip = $scope.current_contest.joining.chip;
}
//console.log("$data =========", $data);
appDB
 .callPostForm('contest/join_contest',$data) 
 .then(
	function success(data){ 
		$scope.closePopup('rejoin_contest_popup');
		$scope.closePopup('selectRejoinTeamChips');
		if(data.code == 200 && data.status == 1){ 
			$scope.openPopup('suss_msg'); 
			$scope.contestMineFetch();
			$rootScope.$broadcast('updateBalanceEvent');             
		} 
	},
	function error(data){
		if (data!=null) {         
			$scope.payErrMsg=data.message;
		}
	});
}
$scope.RejoinTeamToContestPopup = function(){
	 $scope.payErrMsg="";
}

$scope.addTeamToContest = function(){
	var $data={};
	$data.login_session_key     = $localStorage.userDetails.login_session_key; 
	$data.user_id               = $localStorage.userDetails.user_id;
	$data.contest_id            = $scope.current_contest.id;
	$data.joining_amount        = $scope.current_contest.team_entry_fee;
	$data.team_id               = $scope.selectTeam;
	$data.match_id              = $scope.currentSelectedMatch;
	//console.log("$data =========", $data);
	appDB
   .callPostForm('contest/join_contest',$data) 
   .then(
		function success(data){ 
			$scope.closePopup('selectTeam');
			if(data.code == 200 && data.status == 1){ 
				$scope.openPopup('suss_msg');              
			} 
		},
		function error(data){
			$scope.closePopup('selectTeam');
			console.log(data);
			if (typeof data != undefined && data!=null) {         
				$scope.payErrMsg=data.message;
			}
		});
	}
	/*Handle Team Operation*/
	$scope.teamOperation = function(o,id){
	   $rootScope.operation = {type:o,team_id:id};
	   $rootScope.currentSelectedMatch = $scope.currentSelectedMatch;
	   $rootScope.currentSelectedMatchDetails = $scope.currentSelectedMatchDetails;
	   $location.url('/team');
	}
	$scope.teamContestData = {};
	$scope.EditTeamToContest = function(){
		var str_array = $scope.teamContestData.selectedTeam.split(',');
		$scope.teamContestData.selectedTeamId 	= str_array[0];
		$scope.teamContestData.selectedTeamName = str_array[1];
		
		var $data={};
		$data.login_session_key     = $localStorage.userDetails.login_session_key; 
		$data.user_id               = $localStorage.userDetails.user_id;
		$data.contest_id            = $scope.teamContestData.contest_id;
		$data.match_id              = $scope.teamContestData.match_id;
		$data.user_team_id          = $scope.teamContestData.selectedTeamId;

		appDB.callPostForm('contest/edit_contest_team',$data) 
   		.then(
 		function success(data){ 
   			if(data.code == 200 && data.status == 1){ 
					 let contestDummy = {id:$data.contest_id};
					 let teamsDetails = {};
					 $scope.showContestTeam(contestDummy,teamsDetails,true);
					 $scope.closePopup('edit_contest_team_popup');
					 $scope.alert_title 	= "Success Message!";
					 $scope.alert_message 	= "Team Successfully updated to Contest";
					 $scope.openPopup('alert_msg');
					}
				else{
					$scope.alert_title 	= "Error Message!";
					$scope.alert_message 	= "Something went wrong, please contact to administrator!";
					$scope.openPopup('alert_msg');
				}		
				},
		function error(data){ 
 			if (typeof data!= undefined && data.status==0) {
 				$scope.closePopup('edit_contest_team_popup');
	  		$scope.clearPopup();

				console.log(data);
				if (typeof data!= undefined && data!=null) {         
					$scope.alert_title 		= "Error Message!";
	   				$scope.alert_message 	= data.message;
	   				$scope.openPopup('alert_msg');
				}
			}
		});
	}

	$scope.teamList = [];
	$scope.editTeamToContestPopup = function(team_id,name, contestData){
		$scope.teamContestData.selectedTeam 	= team_id+','+name;
		$scope.teamContestData.contest_id		= contestData.id;
		$scope.teamContestData.match_id			= contestData.match_id;
		$scope.teamList 						= $scope.teamsDetails;
		$scope.openPopup('edit_contest_team_popup');  
	}
	$scope.isMatchActive = false;
	$scope.isMatchActiveFun = function(matchdateTime){
		var now = new Date().getTime();
		var countDownDate = new Date($scope.currentSelectedMatchDetails.dateTime).getTime();

		if(countDownDate<now){
			$scope.isMatchActive = false;
		}else{
			$scope.isMatchActive = true;
		}
	}
	// $scope.$on('getTeamList',function(event,teamList){
	// 	$scope.teamList = teamList;
 //    });
 $scope.changeChipConsumption = function(){
	$scope.addCash = {};
	$scope.isWalletSubmitted = false;
	$scope.errorAmount = false;
	$scope.errorAmount = '';
	if(typeof $scope.join.chip!='undefined' && $scope.join.chip.match(/^0[0-9].*$/))
	{
			$scope.join.chip = $scope.join.chip.replace(/^0+/, '');
	}
	if(parseInt($scope.join.chip)>parseInt($scope.accountchipbalance))
	{
			$scope.errorAmount = true;
			$scope.errorAmountMsg = 'You can not use chips more than available';
			$scope.join.chip = $scope.join.chip;
			$scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseFloat($scope.accountbalance)-parseInt($scope.join.chip);
			return false;
	}
	if(typeof $scope.join.chip=='undefined')
	{   $scope.join.chip = 0;
			if(parseFloat($scope.current_contest.display_join_amount)>parseFloat($scope.accountbalance))
			{   $scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseFloat($scope.accountbalance)-parseInt($scope.join.chip);
					$scope.amount = Math.ceil($scope.amount);
					$scope.addCashAllow = true;
					$scope.selectTeamAllow = false;
			}
			else if(parseFloat($scope.current_contest.display_join_amount)<parseFloat($scope.accountbalance))
			{
					$scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseInt($scope.join.chip);
					$scope.addCashAllow = false;
					$scope.selectTeamAllow = true;
			}
			else
			{
					$scope.amount = parseFloat($scope.current_contest.display_join_amount);
					$scope.addCashAllow = false;
					$scope.selectTeamAllow = true;
			}
			return false;    
	}
	if(parseInt($scope.join.chip)==0 && parseFloat($scope.current_contest.display_join_amount)>parseFloat($scope.accountbalance))
	{
			$scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseFloat($scope.accountbalance);
			$scope.addCashAllow = true;
			$scope.selectTeamAllow = false;
	}
	else if(parseFloat($scope.current_contest.team_entry_fee)>parseFloat($scope.accountbalance))
	{   $scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseFloat($scope.accountbalance)-parseInt($scope.join.chip);
			$scope.amount = Math.ceil($scope.amount);
			$scope.addCashAllow = true;
			$scope.selectTeamAllow = false;
	}
	else if(parseFloat($scope.current_contest.team_entry_fee)<parseFloat($scope.accountbalance))
	{
			$scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseInt($scope.join.chip);
			$scope.addCashAllow = false;
			$scope.selectTeamAllow = true;
	}
	//$scope.amount = Math.ceil(parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip))-parseInt($scope.join.chip);
	
	if(parseFloat($scope.amount)>=(parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip)))
	{
			$scope.amount = parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip);
	}
	if($scope.amount>$scope.accountbalance)
	{
			$scope.addCashAllow = true;
			$scope.selectTeamAllow = false;
	}
}

$scope.changeAmount = function(){
	$scope.isWalletSubmitted = false;
	$scope.errorAmount = false;
	$scope.errorAmount = '';
	if(typeof $scope.amount!='undefined' && $scope.amount.match(/^0[0-9].*$/))
	{
			$scope.amount = $scope.amount.replace(/^0+/, '');
	}
	if($scope.amount>10000 || $scope.amount<50)
	{
			$scope.amount = $scope.current_contest.team_entry_fee;
			$scope.errorAmount = true;
			$scope.errorAmountMsg = 'Max limit of adding balance is 10000 and min limit is 50';
			return false;
	}
}
 	$scope.rejoinPopup = function(contest){
 		$scope.current_contest = contest;
		$scope.join = {};   
		if(parseInt(contest.contest_size)<=parseInt(contest.total_join_team))
		{
			 $scope.openPopup('contest_fullfilled');
			 return false;
		}
        $scope.getUnjoinTeams(contest);
        if($scope.teamList.length > 0){
					/*Handle Rejoin Chips & Entry Fee*/
					/*open join contest popup*/
        	// if(parseFloat(contest.team_entry_fee) > parseFloat($scope.totalBalance)){
		      //   //$scope.amount 					= $scope.current_contest.team_entry_fee-$scope.totalBalance;
						//$rootScope.rejoinRecordedAction		= {'action':'add-cash-to-wallet','data':contest};
						$scope.accountbalance = $scope.totalBalance;
						$scope.accountchipbalance = $scope.chipBalance;
						//$scope.openPopup('not_enough_cash1');
						$scope.current_contest.display_join_amount = parseFloat($scope.current_contest.chip)+parseFloat($scope.current_contest.team_entry_fee);
						
						if($scope.current_contest.hasOwnProperty('joining'))
						{
								if(parseFloat($scope.current_contest.display_join_amount)==parseFloat($scope.current_contest.joining.chip)+parseFloat($scope.current_contest.joining.cash))
								{
									 $scope.openPopup('selectRejoinTeamChips');
									 return false; 
								}
						}

						if(parseInt($scope.current_contest.chip)==0) // Pure Cash Contest
						{
								if(parseFloat($scope.current_contest.team_entry_fee)>parseFloat($scope.accountbalance))
								{   $scope.amount = $scope.current_contest.team_entry_fee-$scope.accountbalance;
										$scope.openPopup('not_enough_cash1');
								}
								else
								{
										$scope.openPopup('selectTeam1'); 
								}
						}
						else if(parseFloat($scope.current_contest.team_entry_fee)==parseFloat('0') && parseFloat($scope.current_contest.chip)>parseFloat('0')) // Pure chip contest
						{
								// Logic Pending
						}
						else  // Mix Contest
						{
								if(parseFloat($scope.accountbalance)>=parseFloat($scope.current_contest.team_entry_fee) && parseInt($scope.accountchipbalance)>=parseInt($scope.current_contest.chip))
								{
										$scope.amount = $scope.current_contest.team_entry_fee;
										$scope.join.chip = $scope.current_contest.chip;
										$scope.addCash = false;
										$scope.selectTeamAllow = true;
								}
								if(parseFloat($scope.accountbalance)>=parseFloat($scope.current_contest.team_entry_fee) && parseInt($scope.accountchipbalance)<parseInt($scope.current_contest.chip))
								{
										$scope.join.chip = $scope.accountchipbalance;
										$scope.amount = (parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip))-parseInt($scope.join.chip);
										if(parseFloat($scope.amount)>parseFloat($scope.accountbalance))
										{   $scope.amount = $scope.amount-$scope.accountbalance
												$scope.addCashAllow = true;
												$scope.selectTeamAllow = false;
										}
										else 
										{
												$scope.addCashAllow = false;
												$scope.selectTeamAllow = true;
										}
								}
								if(parseFloat($scope.accountbalance)<parseFloat($scope.current_contest.team_entry_fee) && parseInt($scope.accountchipbalance)>=parseInt($scope.current_contest.chip))
								{
										$scope.join.chip = $scope.current_contest.chip;
										$scope.amount = (parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip))-parseInt($scope.join.chip);
										if(parseFloat($scope.amount)>parseFloat($scope.accountbalance))
										{   $scope.amount = $scope.amount-$scope.accountbalance
												$scope.addCashAllow = true;
												$scope.selectTeamAllow = false;
										}
										else 
										{
												$scope.addCashAllow = false;
												$scope.selectTeamAllow = true;
										}
		
								}
								if(parseFloat($scope.accountbalance)<parseFloat($scope.current_contest.team_entry_fee) && parseInt($scope.accountchipbalance)<parseInt($scope.current_contest.chip))
								{
										$scope.join.chip = $scope.accountchipbalance;
										$scope.amount = (parseFloat($scope.current_contest.team_entry_fee)+parseInt($scope.current_contest.chip)-$scope.join.chip)-parseFloat($scope.accountbalance);
										$scope.amount = Math.ceil($scope.amount);
										$scope.addCashAllow = true;
										$scope.selectTeamAllow = false;
								}
								if($scope.current_contest.hasOwnProperty('viaChip'))
								{
										$scope.join.chip = $scope.current_contest.viaChip.count;
										/*If Previous Entered chip was unacceptable*/
										if(parseInt($scope.join.chip)>=parseInt($scope.accountchipbalance) && parseInt($scope.accountchipbalance)>=parseInt($scope.current_contest.chip))
										{
												$scope.join.chip = $scope.current_contest.chip;
										}
										else if(parseInt($scope.join.chip)>=parseInt($scope.accountchipbalance) && parseInt($scope.accountchipbalance)<parseInt($scope.current_contest.chip))
										{
												$scope.join.chip = $scope.accountchipbalance;
										}
										else if(parseInt($scope.join.chip)>=parseInt($scope.current_contest.chip) && parseInt($scope.accountchipbalance)>=parseInt($scope.current_contest.chip))
										{
												$scope.join.chip = $scope.current_contest.chip;
										}
										else if(parseInt($scope.join.chip)>=parseInt($scope.current_contest.chip) && parseInt($scope.accountchipbalance)<parseInt($scope.current_contest.chip))
										{
												$scope.join.chip = $scope.accountchipbalance;
										}
										/*Calculations after Recharge with Chip*/
										if(parseFloat($scope.current_contest.display_join_amount)>parseFloat($scope.accountbalance)+parseInt($scope.accountchipbalance))
										{   $scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseFloat($scope.accountbalance)-parseInt($scope.join.chip);
												$scope.amount = Math.ceil($scope.amount);
												$scope.addCashAllow = true;
												$scope.selectTeamAllow = false;
										}
										else
										{
												$scope.amount = parseFloat($scope.current_contest.display_join_amount)-parseInt($scope.join.chip);
												$scope.addCashAllow = false;
												$scope.selectTeamAllow = true;
										}
										
								}
							 $scope.openPopup('add_chips1');
							}	
					// }
					// else
					// {
          //   	$scope.openPopup('rejoin_contest_popup');
        	// }
				}
				else
				{
        	/*open create team*/
        	$rootScope.rejoinRecordedAction	= {'action':'click-on-rejoin-button','data':contest};
        	$scope.checkTeam("You have to create a team first, before Rejoin the contest!");
        }
    }
		/*Handle Rejoin Payment*/
		$scope.selectRejoinTeamChips = function(contest,amount,chip)
    {   contest.joining = {};
        contest.joining.cash = amount;
        contest.joining.chip = chip;
        $scope.closePopup('add_chips1');
        $scope.rejoinPopup(contest)   
        
    }
		$scope.submitRejoinPayment = function(amount,form,isChip){
			$scope.isWalletSubmitted = true;
			if(amount>10000 || amount<50)
			{
					$scope.amount = $scope.current_contest.team_entry_fee;
					$scope.errorAmount = true;
					$scope.errorAmountMsg = 'Max limit of adding balance is 10000 and min limit is 50';
					return false;
			}
			if(!form.$valid)
			{
					return false;
			}
			$sessionStorage.action = {'isFromPaytm':'0','page':'contest','currentSelectedSeries':$scope.currentSelectedSeries,'currentSelectedMatch':$scope.currentSelectedMatch,'currentSelectedMatchDetails':$scope.currentSelectedMatchDetails,'currentSelectedContest':$scope.current_contest,'join_type':'join','amount':amount};
			if(isChip==true)
			{
			 $sessionStorage.action.isChip = true;
			 $sessionStorage.action.chipCount = $scope.join.chip;   
			}
			else
			{
				$sessionStorage.action.isChip = false;
				$sessionStorage.action.chipCount = 0;   
							
			}
			if($rootScope.recentCreatedSelfContest)
			{
					$sessionStorage.action.is_self_contest = true;
					delete $rootScope.recentCreatedSelfContest;
			}
			$scope.closePopup('not_enough_cash');
			$location.url('/payment-mode');
	}
		$scope.getUnjoinTeams = function(contest){
 		$scope.teamList = [];
        /*Get unjoin teams*/
        var teamsDetails = $scope.teamsDetails;
        for(var i=0; i<teamsDetails.length;i++){
					var obj = contest.join_in_team.find(function (obj)
					 { 
						 return obj.team_id === teamsDetails[i].team_id; 
					});
        	if(!obj){
        		$scope.teamList.push(teamsDetails[i]);
        	}
				}
			
    }

    $scope.checkRootScope = function(){
    	var actionObj = $rootScope.rejoinRecordedAction;
			if($rootScope.hasOwnProperty('rejoinRecordedAction'))
			{
				delete $rootScope.rejoinRecordedAction;
			}
			if(typeof actionObj == 'object' && actionObj.hasOwnProperty('action') && actionObj.action == "click-on-rejoin-button"){
    		$rootScope.rejoinRecordedAction	= {'action':'create-team-to-rejoin','data':actionObj.data};
    	}
    }
    $scope.rejoinPopUpFlow = function(){
	 	let actionObj = $rootScope.rejoinRecordedAction;
	 	if(actionObj.action == 'add-cash-to-wallet' || actionObj.action == 'create-team-to-rejoin')
	    $scope.rejoinPopup(actionObj.data);
	    delete $rootScope.rejoinRecordedAction;
	        
	 }
    $scope.submitPaytm = function(amount){
    	$sessionStorage.action = {'isFromPaytm':'0','page':'contest','currentSelectedSeries':$scope.currentSelectedSeries,'currentSelectedMatch':$scope.currentSelectedMatch,'currentSelectedMatchDetails':$scope.currentSelectedMatchDetails,'currentSelectedContest':$scope.current_contest,'join_type':'rejoin'};
        $scope.payTmReq(amount);
    }

  // $scope.getTeamList=[];
  // $scope.getTeamPlayers=[];
  // $scope.playersByTeam = {}; 
  // $scope.getTeamByMatchId = function(matchId) {
  //   let data={};
  //   data.match_id = matchId;
  //   data.login_session_key = $localStorage.userDetails.login_session_key;
  //   data.user_id = $localStorage.userDetails.user_id;
  //   appDB.callPostForm('match/user_team_list',data) 
  //   .then(
  //     function success(data){ 
  //       if(data.code == 200 && data.status == 1){ 
  //         $scope.getTeamList=data.response;
  //         $scope.getTeamMsg=data.message;
  //         $scope.getTeamErr="";
  //         for (var i = 0; i < $scope.getTeamList.length; i++) {
  //           $scope.getTeamPlayers= $scope.getTeamList[i].players;
  //         }
  //       } 
  //     },
  //     function error(data){ 
  //       if (data.status==0) {
  //         $scope.getTeamErr=data.message;
  //         $scope.getTeamMasg="";
  //         $scope.getTeamList=[];
  //       }
  //     });
  // }

  // $scope.getTeamPlayerlist = function(teamId) {
  //   console.log("team Id ",teamId);
  //   for (var i = 0; i < $scope.getTeamList.length; i++) {
  //     $scope.getTeamPlayers= $scope.getTeamList[i].players;
  //     if ($scope.getTeamList.hasOwnProperty(teamId) ) {
  //      console.log("get team players ",$scope.getTeamList[teamId]);

  //    }
  //     console.log("players team ",$scope.playersByTeam);
  //   }
  // }
   /* Emit Received*/
   $scope.$on('joinedContest',function(event, contest){
		$scope.contestMineFetch();
		angular.forEach($scope.currentContestList,function(value,key){
	  if(value.id==contest.id)
	  {
			$scope.currentContestList[key].is_user_joined=1;
			if(value.mega_contest==1) //As we believe only one mega contest will be there we are implementing Direct Update in mega-contest
			{
				$scope.megaContest.is_user_joined = 1;
			}
		
	  }
	});
	 });
	 /*Invite code*/
	 $scope.codeContest = {};
	 $scope.searchCode = function(){
		 
		 let $data =  {};
		 $data.login_session_key = $scope.userDetails.login_session_key;
		 $data.user_invite_code =  $scope.codeContest.contestJoinCode;
		 $data.match_id = $scope.currentSelectedMatch;
		 appDB.callPostForm('contest/to_check_contest',$data) 
		 .then(
			function success(data){ 
					if(data.code == 200 && data.status == 1){ 
						if(typeof data.response=='object'){
							$rootScope.$broadcast('current_contest_emit',data.response);
						}
				    
					} 
			},
			function error(data){ 
				if(typeof data!= undefined){
					$scope.alert_title = "Oops! Something Went Wrong!";
					$scope.alert_message = data.message;
					$scope.openPopup('alert_msg');
				}
			
			});
	
		
		}
		$scope.openPage = function(url){
			$window.open(url, '_blank');
		}

		$timeout(function(){
			if($sessionStorage.hasOwnProperty('firstLogin') && $sessionStorage.firstLogin == true)
			{
				$scope.openPopup('complete_profile');
				delete $sessionStorage.firstLogin;
			}
		}.bind($scope),2000);
		
		$scope.downloadTeamAction = function(contest_id){
			var $data = {};
			$data.login_session_key = $localStorage.userDetails.login_session_key;
			$data.contest_id = contest_id;
			$data.match_id = $scope.currentSelectedMatch;
			appDB.callPostForm('contest/download_contest_team',$data) 
			.then(
			 function success(data){ 
					 if(data.code == 200 && data.status == 1){ 
						 if(data.hasOwnProperty('file_url') && data.file_url!='')
						 {
							 $scope.openPage(data.file_url);
						 }
					 } 
			 },
			 function error(data){ 
				 if(typeof data!= undefined){
					 $scope.alert_title = "Oops! Something Went Wrong!";
					 $scope.alert_message = data.message;
					 $scope.openPopup('alert_msg');
				 }
			 
			 });
	 
		
		}
		$scope.getSingleMatchDetails = function(){
			var $data = {};
			$data.login_session_key = $localStorage.userDetails.login_session_key;
			$data.match_id = $scope.currentSelectedMatch;
			appDB.callPostForm('match/matche_detail',$data) 
			.then(
			 function success(data){ 
					 if(data.code == 200 && data.status == 1){ 
						 if(data.response.match_status=='LIVE'){
							$scope.currentSelectedMatch.gameStatus = data.response.match_status;
							$scope.currentSelectedMatch.localteam_first_inning = data.response.localteam_first_inning;
							$scope.currentSelectedMatch.localteam_second_inning = data.response.localteam_second_inning;
							$scope.currentSelectedMatch.visitorteam_first_inning = data.response.visitorteam_first_inning;
							$scope.currentSelectedMatch.visitorteam_second_inning = data.response.visitorteam_second_inning;
							$scope.currentSelectedMatch.live_score_status = data.response.live_score_status;
						 }
						else
						{
							$scope.currentSelectedMatch.gameStatus = data.response.match_status;
						}
						} 
			 },
			 function error(data){ 
				 if(typeof data!= undefined){
				 }
			 
			 });
		}

		
}
else
{
  $location.url('/login');
}
}]);
