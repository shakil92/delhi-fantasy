'use strict';
app.directive('matchList',['$interval',function($interval){
 return {
  restrict: 'E',
  controller:'matchListCtrl',
  templateUrl:'Front-End/app/pages/contest/matchlist.html',
  link: function(scope, element, attributes){
   scope.applySlider = function(){
    if ($('.events_list_slider').length > 0) {
      if(scope.isSetUp==true) {
        $('.events_list_slider').slick("slickRemove"); 
        $('.events_list_slider').slick("slickAdd");
        $('.events_list_slider').slick('unslick');
      } else { 
        scope.isSetUp = true;
      }
      $('.events_list_slider').not('.slick-initialized').slick({
     //  $('.events_list_slider').slick({
      dots: false, 
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
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
        _that.html(gape);
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
    scope.closeContestPopup = function(){
      scope.closePopup('creat_contest');
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
      scope.contest_sizes = 0;
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

app.controller('matchListCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB',function($scope,$rootScope,$location,$window,$localStorage,appDB){
    //$scope.AllGame = {};
    $scope.selectedMatchId="";
    if($rootScope.hasOwnProperty('currentSelectedMatch') && $rootScope.hasOwnProperty('currentSelectedMatchDetails')){
      $scope.seriesId=$rootScope.currentSelectedMatchDetails.seriesID;
      $scope.fetchMatch();
      $scope.isClosed = false;
    }
    $scope.matches = [];  
    $scope.clearTeamFormation();

    $scope.changeCurrentMatch = function(id,isClosed,matchDetails){
      $scope.currentSelectedMatch = id; // On Click change current Selected match
      $scope.currentSelectedMatchDetails = {};
      $scope.currentSelectedMatchDetails.seriesID = matchDetails.series_id;
      $scope.currentSelectedMatchDetails.localteamID = matchDetails.localteam_id;
      $scope.currentSelectedMatchDetails.visitorteamID = matchDetails.visitorteam_id;
      $scope.currentSelectedMatchDetails.localteam = matchDetails.localteam;
      $scope.currentSelectedMatchDetails.visitorteam = matchDetails.visitorteam;
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
      $scope.setUserTeam();
  }
  $scope.changeContestWinnerPriceDisplay = function(index){
    $scope.contestWinnerPrice[index] = !$scope.contestWinnerPrice[index];
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

     /*Function to Fetch Matches*/
     $scope.$watch('contest_sizes',function (newValue,oldValue) { 
      $scope.number_of_winners = '';
      if(newValue!=oldValue)
      {
        $scope.totalEntry = $scope.total_winning_amount / $scope.contest_sizes;
        $scope.team_entry_fee=($scope.totalEntry * $scope.adminPercent / 100 +$scope.totalEntry).toFixed(2);
      }
    });

     $scope.$watch('total_winning_amount',function (newValue,oldValue) { 
      if(newValue!=oldValue)
      {
        $scope.totalEntry = $scope.total_winning_amount / $scope.contest_sizes;
        $scope.team_entry_fee=($scope.totalEntry * $scope.adminPercent / 100 +$scope.totalEntry).toFixed(2);
        $scope.clearForm(); 
      }
    });

     /*------------calculate Percent and Amount-------------------*/
     $scope.choices = [];    
     $scope.amount =0.00;

     $scope.changePercent = function(x){

       if(x!=0 && x>0 && parseFloat($scope.choices[x].percent)>parseFloat($scope.choices[x-1].percent))
       {
        $scope.choices[x].percent='';
        return false;
      }
      let total = 0;
      for (var i = 0; i < $scope.choices.length; i++) {
        total = total + parseFloat($scope.choices[i].percent);
      }
      if(total>100)
      {
        $scope.choices[x].percent='';
        alert('Total can not be more than 100%');
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
          $scope.choices[i].amount = ($scope.winnersAmount / persenCount).toFixed(2);
        }
      }
    }
    $scope.changeWinners= function () {
     $scope.showField =false;
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
      alert('Last Percentage is blank');
      return false;
    }
    if($scope.totalPercentage==100)
    {
      alert('Amount money Has been Distributed Already')
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
    alert('no add field');
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
  if(index >= 0){
   $scope.choices.splice(index, 1);
 }
}



/*------------ show  and hide form-------------------*/  
$scope.showField = false;
$scope.numbers=[];
$scope.Showform = function () { 

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
  return false;
}
}

$scope.createContest = function(form){

      // $scope.helpers = Mobiweb.helpers;
      $scope.submitted = true;
      if(!form.$valid)
      {
        return false;
      }
      if($scope.hasOwnProperty('winnings') && $scope.winnings==true && parseInt($scope.number_of_winners)<1 && parseInt($scope.contest_sizes)<parseInt($scope.number_of_winners ))
      {
        return false;
      }
      if($scope.winnings==true && $scope.totalPersonCount!=$scope.numbers.length)
      {
        alert('Price Amount has not been decided for all winners!');
        return false;
      }
      if($scope.totalPercentage!=100)
      {
        alert('Prize amount is not distributed fully!');
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
            $scope.clearPopup();
            $scope.contestFetch();
            $scope.contestMineFetch();
          } 
        } 
      },
      function error(data)
      { 
           //Handle Error
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

app.controller('contestCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window){

  if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
  {
    $scope.coreLogic = Mobiweb.helpers;
    $scope.isClosed = 'true'; //considering selected match is closed.

    

    /*Create Team Page Redirection*/
    $scope.createTeam = function(){
      $scope.closePopup("check_team");
      $rootScope.currentSelectedMatch = $scope.currentSelectedMatch;
      $rootScope.currentSelectedMatchDetails = $scope.currentSelectedMatchDetails;
      $location.url('/team');
    }

    /*Fetch Match*/
    $scope.fetchMatch = function(){
      var $data = {};
      $data.login_session_key = $localStorage.userDetails.login_session_key;   
      if($scope.currentSelectedSeries!=false)
      {
        $data.series_id = $scope.currentSelectedSeries;
      }else if($scope.seriesId!=undefined){
       $data.series_id=$scope.seriesId;
     }
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
              let detailHolder = 0;
              for(var $i=0,len=$scope.matches.length;$i<len;++$i)
              { 
                var localeDateTime = $scope.coreLogic.getLocalDateTime($scope.matches[$i].match_date,$scope.matches[$i].match_time);
                $scope.matches[$i].match_date = localeDateTime.getFullYear()+"-"+(localeDateTime.getMonth()+1)+"-"+localeDateTime.getDate();
                $scope.matches[$i].match_time = ('0'+localeDateTime.getHours().toString()).slice(-2)+":"+('0'+localeDateTime.getMinutes().toString()).slice(-2);
                if($scope.selectedMatchId!="" && $scope.selectedMatchId==$scope.matches[$i].match_id)
                {
                  detailHolder = $i;
                }
              }
            $scope.endTimeHandler(); //Functionality for maintain End Time and If Contest is closed
            /*Handle Current Selected Match, IsClosed && Current Selected Match Details*/
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
            var date = $scope.matches[detailHolder].match_date+" "+$scope.matches[detailHolder].match_time+":00";
            var matchTime=$scope.matches[detailHolder].match_time;
            if (matchTime > '24' || matchTime=="TBA") {
              $scope.currentSelectedMatchDetails.dateTime=$scope.matches[detailHolder].match_date+" "+"00:00";
            }else{
              $scope.currentSelectedMatchDetails.dateTime = date;
            }

            $scope.contestWinnerPrice = [];
            for(var $i=0,len=$scope.matches.length;$i<len;++$i)
            {
              $scope.contestWinnerPrice.push(false);
            } 
            $scope.contestFetch();
            $scope.contestMineFetch();
            $scope.megaContestFetch();
            setTimeout(function(){
                $scope.applySlider();
                $scope.setUserTeam();
              },50);                     
            } 
          } 
        },
        function error(data)
        { 
          $scope.matches =[];
          $scope.status=data.status;
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
     function success(data)
     { 
       if(data.code == 200)
       { 
        if(data.code == 200 && data.status == 1)
        { 
          //Handle Success 
          $scope.currentContestList = data.response;
          $scope.allContMsg="";
          $scope.contestErr="";
        } 
      } 
    },
    function error(data)
    { 
     $scope.currentContestList = [];
     if (data.status == 0) {
      $scope.allContMsg="There is no contest for this match!";
      $scope.contestErr="";
    }
  }
  );
  } 

  $scope.contestMineFetch = function(){
    let $data = {};
    $data.user_id = $scope.userDetails.user_id;
    $data.login_session_key = $scope.userDetails.login_session_key;
    $data.match_id = $scope.currentSelectedMatch;
    appDB.callPostForm('contest/my_contests',$data) 
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
     if(data.status == 0){ 
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
          if($scope.megaContest.length>0)
          {
           $scope.megaContest = $scope.megaContest[0];
           $scope.hasMegaContest = true;
         }

       } 
     } 
   },
   function error(data)
   { 
    $scope.megaContest = {};
    $scope.hasMegaContest = false;
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

  /*Filter for contest list starts*/
  $scope.contestFilter = function(value){      
    let $data = {};
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
          $scope.contestErr="";
          $scope.allContMsg="";
        } 
      },
      function error(data){ 
        if (data.status==0) {
          $scope.contestErr="No matches found!";
          $scope.allContMsg="";
          $scope.currentContestList=[];
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
        $scope.teamCount = $scope.teamsDetails.length;
        if($rootScope.hasOwnProperty('latestTeamCreated')){
          $scope.availablePlayer = $scope.teamsDetails [$scope.teamsDetails .length - 1];
          $scope.latestTeam=$rootScope.latestTeamCreated;
          $scope.availablePlayer.team_id;
          $scope.teamsDetails.currentSelectedTeam=  $scope.availablePlayer.team_id;
        }else{
          $scope.availablePlayer = $scope.teamsDetails[0];
          $scope.teamsDetails.currentSelectedTeam = $scope.teamsDetails[0].team_id
        }
        
      } 
    },
    function error(data){ 
     if (data.status==0) {
      $scope.teamCount = 0;
    }
  });
 }
 $scope.teamChange = function(){
  for(var $teamI=0,$teamL=$scope.teamsDetails.length;$teamI<$teamL;$teamI++)
  {
    if($scope.teamsDetails[$teamI].team_id==$scope.teamsDetails.currentSelectedTeam){
      $scope.availablePlayer = $scope.teamsDetails[$teamI];
    }
  }
}
$scope.clearTeamFormation = function(){
  $scope.teamsDetails = [];
  $scope.availablePlayer = [];
  $scope.playerListDefault = [{playerSeat:11},{playerSeat:10},{playerSeat:9},{playerSeat:8},{playerSeat:7},{playerSeat:6},{playerSeat:5},{playerSeat:4},{playerSeat:3},{playerSeat:2},{playerSeat:1}];
}
$scope.joinContest = function(id){
	$scope.openPopup('join_contest');
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



}
else
{
  $location.url('/login');
}
}]);