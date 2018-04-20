
app.directive('selectCaptaintype', function() {
  return {
    restrict: 'E',
    controller: 'uerProfileCtrl',
    templateUrl: 'Front-End/app/pages/team/selectCaptain.html',
    link: function(scope, element, attributes) {}
  };
});

app.controller('teamCtrl', ['$scope','environment', '$rootScope', '$location', '$window', '$localStorage', 'appDB', 'sportsCollection','$interval','$sessionStorage', function($scope,environment, $rootScope, $location, $window, $localStorage, appDB, sportsCollection,$interval,$sessionStorage) {
  if ($localStorage.isLoggedIn == true) {
    if ($rootScope.hasOwnProperty('currentSelectedMatch') && $rootScope.hasOwnProperty('currentSelectedMatchDetails')) {
      $scope.env = environment;
      $scope.coreLogic = Mobiweb.helpers;
      $scope.userDetails = $localStorage.userDetails;
      $scope.currentSelectedMatch = $rootScope.currentSelectedMatch;
      $scope.currentSelectedMatchDetails = $rootScope.currentSelectedMatchDetails;
      $scope.seriesId=$rootScope.currentSelectedMatchDetails.seriesID;
      $scope.localteam = $scope.currentSelectedMatchDetails.localteam;
      $scope.visitorteam = $scope.currentSelectedMatchDetails.visitorteam;	  	  
      $scope.teamError = false;	  	  
      $scope.teamErrorMessage = '';
      $scope.allplayers = [];
      $scope.availablePlayer = [];
      $scope.totalPlayers = sportsCollection.teamPlayerLimit;
      $scope.selectedPlayers = 0;
      $scope.playerSeat = 0;
      $scope.chooseSelectedPlayers = [];
      $scope.teamCreation = {}; //Holds Drafting for easy handling where keys are id of selected players
      $scope.playerRole = ["WICKETKEEPER","BATSMAN","ALLROUNDER","BOWLER"];
      $scope.playerRoleAbbreviation = ["WC","BM","AR","BL"];
      $scope.pl = {};
      $scope.captainIcon = false;
      $scope.viceCaptainIcon = false;
      /*Handle Player Section Tab*/
      $scope.activeTab = 'WC';	  	 
      $scope.hasMegaContest = false;
      $scope.currentCredit = 100;
       
      if($sessionStorage.hasOwnProperty('userTeamCount') && $sessionStorage.userTeamCount>0)
      {
        $scope.userTeamCount = parseInt($sessionStorage.userTeamCount)+1;
        $scope.userTeamName = 'Team '+$scope.userTeamCount;
      }
      else
      {
        $scope.userTeamCount = 1;
        $scope.userTeamName = 'Team '+$scope.userTeamCount;
      }
      /*Handle Popup-session*/
      if($rootScope.hasOwnProperty('recordedAction') && $rootScope.recordedAction.action=='create-contest')
      {
        $rootScope.recordedAction.lastPage = 'create-team';
      }
      $scope.substractCredit = function(point){
        var lastCredit = $scope.currentCredit;
        var $x = parseInt(point);
       let intervalHolder = $interval(function(){
            --$scope.currentCredit;
            --$x;
            if($x<1)
            {
              $scope.SettleCredit(lastCredit,point,1,intervalHolder);
            }
        }, 5);
      }
      $scope.addCredit = function(point){
        var lastCredit = $scope.currentCredit;
        var $x = parseInt(point);
       let intervalHolder = $interval(function(){
            ++$scope.currentCredit;
            --$x;
            if($x<1)
            {
              $scope.SettleCredit(lastCredit,point,0,intervalHolder);
            }
        }, 5);
      }
      $scope.SettleCredit = function(a,b,c,d){
        $interval.cancel(d);
        if(c==1)
        {
          $scope.currentCredit = parseFloat(a)-parseFloat(b);
        }
        else{
          $scope.currentCredit = parseFloat(a)+parseFloat(b);
        }
        $scope.hideLoaderBarrier();
        
      }
     // $scope.currentSelectedSeries = false;
     $scope.changeActiveTab = function(activeTab){
      $scope.activeTab = activeTab;
    }
     /*Handle Team Operations Like Clone & Edit*/
     if($rootScope.hasOwnProperty('operation'))
     {
       $scope.operation = $rootScope.operation;
       delete $rootScope.operation;
     
     }
    
    /*Fetch All Players */
    $scope.getPlayerDetails = function() {
      let $data = {};

      $data.login_session_key = $scope.userDetails.login_session_key;
      $data.series_id = $scope.currentSelectedMatchDetails.seriesID;
      $data.localteam_id = $scope.currentSelectedMatchDetails.localteamID;
      $data.visitorteam_id = $scope.currentSelectedMatchDetails.visitorteamID;
      $data.match_id = $scope.currentSelectedMatch;
      $scope.countDownTimer = $scope.coreLogic.getTimeGapFormat2($scope.currentSelectedMatchDetails.dateTime);
      setInterval(function() {
        $scope.countDownTimer = $scope.coreLogic.getTimeGapFormat2($scope.currentSelectedMatchDetails.dateTime);
        $scope.$apply();
      }, 1000);
      appDB
      .callPostForm('match/match_player', $data)
      .then(
        function success(data) {
          if (data.code == 200) {
            if (data.code == 200 && data.status == 1) {
              $scope.status = data.status;
              $scope.allplayers = data.response;
              $scope.availablePlayer = $scope.allplayers;			  			  
              $scope.fetchMegaContest();
              $scope.addresses = $scope.availablePlayer.map(function(player) {
                player.isAdded = false;
                player.position = "PLAYER";
                return player;
              });

              if($scope.hasOwnProperty('operation')){
                $scope.getTeamDetails();
              }
            }
          }
        },
        function error(data) {
          $scope.status = data.status;
          $scope.playerErrMasg = data.message;
        });
    }
    /*Call function get Player Details */
    $scope.getPlayerDetails();		
    $scope.close_join_popup = function(id){		
      $scope.closePopup(id);		
      $location.url('/contest');	
    };		
    $scope.fetchMegaContest = function()	{
           var data = {};
           data.user_id = $scope.userDetails.user_id;				
           data.login_session_key = $scope.userDetails.login_session_key;				
           data.match_id = $scope.currentSelectedMatch;	   	   
           appDB
           .callPostForm('contest/mega_contests', data)	  
           .then(		function success(data) {		  
             if (data.code == 200 && data.status == 1) {			  
               $scope.megaContest = data.response;			  
               if($scope.megaContest.length>0){
                   $scope.megaContest = $scope.megaContest[0];			   
                   $scope.hasMegaContest = true;			  
                  }					  
                }		
              },		
              function error(data) {						
                $scope.megaContest = {};			
                $scope.hasMegaContest = false;	   		
              });	
    }
    $scope.getTeamDetails = function(){
      let $data = {};
      $data.login_session_key = $scope.userDetails.login_session_key;
      $data.user_team_id = $scope.operation.team_id;
      $data.match_id = $scope.currentSelectedMatch;
      appDB
      .callPostForm('match/team_details', $data)
      .then(
        function success(data) {

          if (data.code == 200) {
            if (data.code == 200 && data.status == 1) {
              if(data.response.hasOwnProperty('players') && data.response.players.length>0){
                if($scope.hasOwnProperty('operation') && $scope.operation.hasOwnProperty('type') && $scope.operation.type=='E')
                {
                  $scope.userTeamName = data.response.name;
                }
                $scope.selectedTeamPlayers = data.response.players;
                let $i=1,usedCredit = 0; 
                $scope.noSmoothNumbering = true;
                angular.forEach($scope.selectedTeamPlayers,function(value,index){
                  var noPopupFirstTimeL = true;
                  if($scope.operation.type=='C')
                  {
                    noPopupFirstTimeL = false;
                  }
                  $scope.addRemovePlayer(value.player_id, false, value,noPopupFirstTimeL);
                  if($scope.operation.type=='E' && value.position=='CAPTAIN')
                  {
                    $scope.pl.captain = value.player_id;
                  }
                  if($scope.operation.type=='E' && value.position=='VICE_CAPTAIN')
                  {
                    $scope.pl.viceCaptain = value.player_id;
                  }
                  /* Add All Credits & once all Player Travers, substract from currentCredit*/
                  usedCredit = usedCredit+parseFloat(value.points);
                  
                  if($i==11)
                  {
                    $scope.currentCredit = $scope.currentCredit-usedCredit;
                    delete $scope.noSmoothNumbering;
                  }
                  $i++;
                });
                   
              }
              else
              {
               $location.url('/contest');
              }
               
            }
          }
        },
        function error(data) {
         
        });
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
    /*Handle Player Removing*/
    $scope.settleTeamOnGround = function(detail,position){
     var mainRemoval = false;
     var checkExtra = false;
     var indexTarget = -1;
     var isMoved = false;
     if($scope.teamStructure[position].player.length>0)
     {
        angular.forEach($scope.teamStructure[position].player,function(value,index){
            if(value.player_id==detail.player_id){
              indexTarget = index;
              mainRemoval = true;
            }
        });
       /* if Found Element in Main players, First try to move from extra and remove from Main*/
          if(mainRemoval==true && indexTarget!=-1 && $scope.teamStructure['EXTRA'].player.length>0)
          {
              angular.forEach($scope.teamStructure['EXTRA'].player,function(valueInner,indexInner){
                if(valueInner.play_role==position){
                $scope.teamStructure[position].player[indexTarget] = valueInner;
                $scope.teamStructure['EXTRA'].player.splice(indexInner,1);
                isMoved = true; 
                }
              });
              /*If move couldn't be success remove from main*/
              if(isMoved==false)
              {
                $scope.teamStructure[position].player.splice(indexTarget,1);
              }
          } /* IF found Element in main player, but Extra players are untouched yet*/
          else if(mainRemoval==true && indexTarget!=-1 && $scope.teamStructure['EXTRA'].player.length==0)
          {
            $scope.teamStructure[position].player.splice(indexTarget,1);
          }
          else /*If Player not found in main Players*/
          {
            angular.forEach($scope.teamStructure['EXTRA'].player,function(value,index){
              if(value.player_id==detail.player_id){
                $scope.teamStructure['EXTRA'].player.splice(index,1);
              }
             });
          }
     }
     else
     {
        return false;
     }
    }
  } else {
    $location.url('/contest');
  }
} else {
  $location.url('/login');
}

/*Handle Captain, Vice Captain & Fabulous*/
$scope.playerListDefault = [
{playerSeat:11},{playerSeat:10},
{playerSeat:9},{playerSeat:8},
{playerSeat:7},{playerSeat:6},
{playerSeat:5},{playerSeat:4},
{playerSeat:3},{playerSeat:2},
{playerSeat:1}];
$scope.selectedTeam = [];

$scope.selectedCaptainlist = '';
$scope.bowler = [];
$scope.batsman = [];
$scope.wicketKeeper = [];
$scope.allRounder = [];

/*Manage validations for min & max player limit criteria for creating a team*/
$scope.teamStructure={
  "WICKETKEEPER":{"min":1, "max":1, "occupied":0,player:[],"icon":"flaticon1-pair-of-gloves"},
  "BATSMAN":{"min":3, "max":5, "occupied":0,player:[],"icon":"flaticon1-ball"},
  "BOWLER":{"min":3, "max":5, "occupied":0,player:[],"icon":"flaticon1-tennis-ball"},
  "ALLROUNDER":{"min":1, "max":3, "occupied":0,player:[],"icon":"flaticon1-ball"},
  "EXTRA":{"min":3,"max":3,occupied:0,player:[]},
  "ready":false
};
$scope.resetTeamStructure = function(){
  $scope.teamStructure={
    "WICKETKEEPER":{"min":1, "max":1, "occupied":0,player:[],"icon":"flaticon1-pair-of-gloves"},
    "BATSMAN":{"min":3, "max":5, "occupied":0,player:[],"icon":"flaticon1-ball"},
    "BOWLER":{"min":3, "max":5, "occupied":0,player:[],"icon":"flaticon1-tennis-ball"},
    "ALLROUNDER":{"min":1, "max":3, "occupied":0,player:[],"icon":"flaticon1-ball"},
    "EXTRA":{"min":3,"max":3,occupied:0,player:[]},
    "ready":false
  };
}
var isBtnReady=false;
$scope.$watch('teamStructure',function(newVal,oldVal){
  let ready = true;
  for(key in $scope.teamStructure){
    if($scope.teamStructure[key].min>$scope.teamStructure[key].occupied){
      ready = false; 
    }
  }
  $scope.teamStructure.ready = ready;
  isBtnReady=ready
},true);


/*Handle Team Player 7 Max*/
$scope.playerInTeam={};
$scope.canSelectTeamPlayer = function(teamName){
  if($scope.playerInTeam.hasOwnProperty(teamName) && $scope.playerInTeam[teamName].count>=7)
  {
    return false;
  }
  else
  {
    return true;
  }
}
$scope.updateTeamPlayer = function(teamName,state)
{
  if($scope.playerInTeam.hasOwnProperty(teamName))
  {
    if(state=='add')
    {
      $scope.playerInTeam[teamName].count = $scope.playerInTeam[teamName].count+1;  
    }
    else
    {
      $scope.playerInTeam[teamName].count = $scope.playerInTeam[teamName].count-1;
    }

  }
  else
  {
    $scope.playerInTeam[teamName] = {'count':1};
  }
}
$scope.closeErrorPopup = function(){	$scope.teamError = false;}
/*Handle Add & Remove Player*/
$scope.addRemovePlayer = function(playerId, isAddedVal, playerDetail,noPopupFirstTime) {
  let playerRole = playerDetail.play_role.toUpperCase();
  var totalPlayersObj = {};  $scope.teamError = false;
  if (isAddedVal == false) {
    totalPlayersObj.id = playerId;
    totalPlayersObj.name = playerDetail.name;
    totalPlayersObj.position = "PLAYER";
  }
  $scope.closePopup('playerDetailPopup');
  var team = {}; var teamArr=[];
  for (var i in $scope.availablePlayer) {
    if ($scope.availablePlayer[i].player_id == playerId && playerDetail.team_id == $scope.availablePlayer[i].team_id) 
    {
      if (isAddedVal == false) {
         
        if(!$scope.canSelectTeamPlayer(playerDetail.team))
        {		  $scope.teamError = true;		  $scope.teamErrorMessage = 'You can\'t add more than 7 Players of same Team';
          return false;
        }
        if ($scope.selectedPlayers < 11) {
         var max=$scope.teamStructure[playerRole].max;
         var min=$scope.teamStructure[playerRole].min;
         var occupied=$scope.teamStructure[playerRole].occupied;

         var minBowler=$scope.teamStructure["BOWLER"].occupied;
         var minBat=$scope.teamStructure["BATSMAN"].occupied;
         var minAllrounder=$scope.teamStructure["ALLROUNDER"].occupied;
         var minWicketKeeper=$scope.teamStructure["WICKETKEEPER"].occupied;
         var $canAdd = true;
         var $minStart = 8;
         var $maxSelect = 11;
         var minObj = [];
         if($scope.teamStructure[playerRole].max==$scope.teamStructure[playerRole].occupied)
         {
          $scope.teamError = true;		  
          $scope.teamErrorMessage = "You can't add more than "+max+" "+playerRole+"!";	
          $canAdd = false;
        }
        else if($scope.selectedPlayers>=$minStart-1){
          let $vacantObj = $scope.getUnsatisfiedPositionCount(playerRole);
          if(!$scope.hasOwnProperty('noSmoothNumbering'))
          {
          angular.forEach($scope.playerRole,function(value,key){
            if(($scope.teamStructure[value].min>$scope.teamStructure[value].occupied) && (playerRole!=value) && $canAdd)
            {
              if(($maxSelect-$scope.selectedPlayers)==($scope.teamStructure[value].min-$scope.teamStructure[value].occupied) && ($vacant==false || $vacant.count==1))
              {
                $canAdd = false;			
                $scope.teamError = true;				
                $scope.teamErrorMessage = "Minimum length of "+value+" must be "+$scope.teamStructure[value].min;
                return false;

              }
              else if($vacant!=false && $vacant.count>1 && (($maxSelect-$scope.selectedPlayers)<=$vacant.totalVacant) && $vacant.position!=playerRole)
              {
                $canAdd = false;				
                $scope.teamError = true;
                $scope.teamErrorMessage = "Minimum length of "+$vacant.position+" must be "+$vacant.min;
                return false;
              }

            }
          });
         }
         }  
        
          
         /*Check Credit Limit*/
        if($scope.currentCredit<playerDetail.points)
        {
          $canAdd = false;				
          $scope.teamError = true;
          $scope.teamErrorMessage = "Maximum Credit limit extending!";
          return false; 
        }
        if(!$canAdd)
        {
          return false;
        }
        else
        {
          $scope.teamStructure[playerRole].occupied = $scope.teamStructure[playerRole].occupied+1; 
          $scope.updateTeamPlayer(playerDetail.team,'add'); 
          addPlayers();
          if($scope.hasOwnProperty('operation') && $scope.operation.type=='E' && playerDetail.hasOwnProperty('player_position') && playerDetail.player_position=="VICE_CAPTAIN")
          {
            $scope.pl.viceCaptain = playerDetail.player_id;
          }
          if($scope.hasOwnProperty('operation') && $scope.operation.type=='E' && playerDetail.hasOwnProperty('player_position') && playerDetail.player_position=="CAPTAIN")
          {
            $scope.pl.captain = playerDetail.player_id;
          }
          if($scope.selectedPlayers==11 && !noPopupFirstTime)
          {
           $scope.openPopup('selectCaptain');
         }

         function addPlayers() {
           $scope.selectedPlayers = $scope.selectedPlayers + 1;
           $scope.playerSeat = $scope.playerSeat + 1;
           $scope.availablePlayer[i].isAdded = true;
           $scope.availablePlayer[i].playerSeat = $scope.playerSeat;
           $scope.teamCreation[playerId.toString()] = {
            'player_id': playerId,
            'name': playerDetail.name,
            'position': 'player',
            'play_role':playerRole,
            'team_id':playerDetail.team_id,
          };
          $scope.setTeamOnGround(playerDetail,playerRole);
          if(!$scope.hasOwnProperty('noSmoothNumbering'))
          { $scope.showLoaderBarrier();
            $scope.substractCredit(playerDetail.points);
          }
          
          /*Remove dummy player, if i added a dynamic player*/
          var playerListDefault = $scope.playerListDefault.indexOf(1);
          $scope.playerListDefault.splice(playerListDefault, 1);
        }
      }  
    } 
    else {
      $scope.teamError = true;
      $scope.teamErrorMessage = "You can not select more than 11 players!";
      return false;
    }
  } else {
    /*Check if bowler length is less than 3,then button should be disabled*/
    if ($scope.teamStructure[playerRole].occupied!=0) {
     $scope.teamStructure[playerRole].occupied = $scope.teamStructure[playerRole].occupied-1;
   }

   $scope.updateTeamPlayer(playerDetail.team,'remove');
   $scope.selectedPlayers = $scope.selectedPlayers - 1;
   $scope.playerSeat = $scope.playerSeat - 1;
   $scope.availablePlayer[i].isAdded = false;
   $scope.availablePlayer[i].playerSeat = $scope.playerSeat;
   $scope.settleTeamOnGround($scope.availablePlayer[i],playerRole);
   $scope.addCredit(playerDetail.points);
   delete $scope.teamCreation[playerId.toString()];
   /*If i removed dynamic player, then add a dummy player*/
   var dummyPlayerObj = {
    playerSeat: $scope.playerSeat
  }
  $scope.playerListDefault.push(dummyPlayerObj);

}
break;
}
}
}
$scope.getUnsatisfiedPositionCount = function(currentRole){
  $count = 0;
  $vacant = {count:0,position:false,totalVacant:0,min:0};
  angular.forEach($scope.playerRole,function(value,key){
    if($scope.teamStructure[value].min>$scope.teamStructure[value].occupied)
    {
     $vacant.count++;
     if($vacant.position==false)
     {
      $vacant.position = value;
      $vacant.totalVacant = $scope.teamStructure[value].min-$scope.teamStructure[value].occupied;
      $vacant.min = $vacant.totalVacant;
    }
    else
    {
      let difference = $scope.teamStructure[value].min-$scope.teamStructure[value].occupied;
      if($vacant.min<$scope.teamStructure[value].min)
      {
        $vacant.position = value;
        $vacant.min = $scope.teamStructure[value].min;
      }
      $vacant.totalVacant = $vacant.totalVacant+difference;
    }
    
  }
});
  if($vacant.count>0)
  {
    return $vacant;
  }
  else
  {
    return false;
  }
}

/*Handle Changes in Drafting*/
$scope.$watchCollection('teamCreation', function() {
  $scope.selectedTeam = [];
  for (var key in $scope.teamCreation) {
    if ($scope.teamCreation.hasOwnProperty(key)) {
      let $obj = {};
      $obj.name = $scope.teamCreation[key].name;
      $obj.id = $scope.teamCreation[key].id;
      $obj.player_id = $scope.teamCreation[key].player_id;
      $obj.position = $scope.teamCreation[key].position;
      $obj.play_role=$scope.teamCreation[key].play_role;
      $obj.team_id = $scope.teamCreation[key].team_id;
      $scope.selectedTeam.push($obj);
    }
  }
 $scope.$watch('pl',function(newVal,oldVal){
    if(newVal!=oldVal)
    {
     delete $scope.specialPlayerSelectionError;
     delete $scope.specialPlayerSelectionErrorMsg;
     delete $scope.teamErrMsg;
     delete $scope.teamSucces;
     if(!$scope.pl.hasOwnProperty('captain'))
     {
      $scope.captainIcon = false;
     }
     if(!$scope.pl.hasOwnProperty('viceCaptain'))
     {
      $scope.viceCaptainIcon = false;
     }
     
    }
 },true); 
  /*if captain has been choose and removed from Drafting*/
  if ($scope.hasOwnProperty('pl') && $scope.pl.hasOwnProperty('captain') && !$scope.teamCreation.hasOwnProperty($scope.pl.captain)) {
    delete $scope.pl.captain;
  }
  /*if vice-captain has been choose and removed from Drafting*/
  if ($scope.hasOwnProperty('pl') && $scope.pl.hasOwnProperty('viceCaptain') && !$scope.teamCreation.hasOwnProperty($scope.pl.viceCaptain)) {
    delete $scope.pl.viceCaptain;
  }
  /*if fabulous has been choose and removed from Drafting*/
  if ($scope.hasOwnProperty('pl') && $scope.pl.hasOwnProperty('fabulous') && !$scope.teamCreation.hasOwnProperty($scope.pl.fabulous)) {
    delete $scope.pl.fabulous;
  }
});
/*Handle All Positions as Player for Clone Team & Edit Team Handling*/
$scope.resetAllPlayerPosition = function(){
  for (let $i = 0, $len = $scope.selectedTeam.length; $i < $len; $i++) {
    $scope.selectedTeam[$i].position = 'player';
  }
}
$scope.updatePlayerPosition = function(id, position) {
  for (let $i = 0, $len = $scope.selectedTeam.length; $i < $len; $i++) {
    if ($scope.selectedTeam[$i].player_id == id) {
      $scope.selectedTeam[$i].position = position;
    }
  }
}
var playerNames = [0];


/*Save team with all the selected players*/
$scope.team = [];

$scope.resetTeam = function(){
  $scope.resetTeamStructure();
  $scope.getPlayerDetails();
  $scope.captainIcon = false;
  $scope.viceCaptainIcon = false;
  $scope.currentCredit = 100;
  $scope.selectedPlayers = 0;
  $scope.playerInTeam={};
  $scope.selectedTeam = [];
  $scope.teamCreation = {};
  if ($scope.hasOwnProperty('pl')) {
    if ($scope.pl.hasOwnProperty('captain')) {
      $scope.pl = {};
    }
    if (!$scope.pl.hasOwnProperty('viceCaptain')) {
      $scope.pl = {};
    }
  }
  $scope.closePopup('reset_team');
}
$scope.saveTeam = function() {
  var teamId = Math.floor(1000 + Math.random() * 9000);
  var data = {};
  data.match_id = $scope.currentSelectedMatch;
  data.login_session_key = $scope.userDetails.login_session_key;
  data.user_id = $scope.userDetails.user_id;
  data.series_id = $scope.seriesId; 
  data.match_id = $scope.currentSelectedMatch;
  data.player_id = "";
  if ($scope.hasOwnProperty('pl')) {
    if (!$scope.pl.hasOwnProperty('captain')) {
      $scope.specialPlayerSelectionError = '1';
      $scope.specialPlayerSelectionErrorMsg = '*Please select captain';
      return false;
    }
    if (!$scope.pl.hasOwnProperty('viceCaptain')) {
      $scope.specialPlayerSelectionError = '1';
      $scope.specialPlayerSelectionErrorMsg = '*Please select vice-captain';
      return false;
    }
  } else {
    $scope.specialPlayerSelectionError = '1';
    $scope.specialPlayerSelectionErrorMsg = '*Please select captain and vice-captain';
    return false;
  }
  $scope.resetAllPlayerPosition();
  $scope.updatePlayerPosition($scope.pl.captain, 'CAPTAIN');
  $scope.updatePlayerPosition($scope.pl.viceCaptain, 'VICE_CAPTAIN');
  
  data.player_id = JSON.stringify($scope.selectedTeam);
  let actionUrl = 'match/create_team';
  if($scope.hasOwnProperty('operation') && $scope.operation.type=='E')
  {
    actionUrl =   'match/edit_team';
    data.user_team_id = $scope.operation.team_id;
  }
  appDB
  .callPostForm(actionUrl, data)
  .then(
    function success(data) {
      if (data.code == 200 && data.status == 1) {
        $scope.status = data.status;
        $scope.team = data.response;
        $scope.teamSuccess=data.message;
        $scope.teamErrMsg="";				
        $rootScope.latestTeamCreated = true;        		
        $scope.closePopup('selectCaptain');        		
        if($scope.hasMegaContest==true)		
        {			
          $scope.openPopup("mega_contest");		
        }
        else		
        {			
          $scope.openPopup("normal_contest");		
        }
      }
    },
    function error(data) {
      $scope.status = data.status;
      $scope.currentSelectedSeries = $scope.seriesId;
      $scope.teamErrMsg=data.message;
      $scope.teamSuccess="";
    });
}



/*After successful team creation show popup for mega join contest*/
$scope.joinMegaContest=function(){
 $scope.closePopup('mega_contest');
 $location.url('/contest');
}
/*------------ Show player detail -------------------*/ 
    $scope.SinglePlayerDetail = function (player_id) {
        var data={};
        data.login_session_key= $scope.userDetails.login_session_key;
        data.player_id= player_id;
        $scope.playerDetail = [];
        appDB
        .callPostForm('match/player_details',data)
        .then(
            function success(data) {
              if(data.code == 200 && data.status == 1){ 

                 $scope.playerDetail = data.response;
                 $scope.openPopup('playerdetail');
                //$scope.errorMsg=""; 
              } 
            },
            function error(data) {
                 //$scope.errorMsg = data.message; 
            }
          );
     } 
      $scope.toggleDiv = false;
      $scope.toggleShowDiv = function(){
        $scope.toggleDiv = !$scope.toggleDiv;
      } 
      $scope.changeCaptain = function(player,selectedTeam)
      { var currentCaptain = false;
        for(var i=0,len=selectedTeam.length;i<len;i++)
        {
          if(player==selectedTeam[i].player_id){
            currentCaptain = selectedTeam[i];
          }
        }
        if(currentCaptain!=false)
        {
          $scope.captainIcon = $scope.teamStructure[currentCaptain.play_role].icon;
        }
        else
        {
          $scope.captainIcon = false;
        }
      }
      $scope.changeViceCaptain = function(player,selectedTeam)
      { var currentViceCaptain = false;
        for(var i=0,len=selectedTeam.length;i<len;i++)
        {
          if(player==selectedTeam[i].player_id){
            currentViceCaptain = selectedTeam[i];
          }
        }
        if(currentViceCaptain!=false)
        {
          $scope.viceCaptainIcon = $scope.teamStructure[currentViceCaptain.play_role].icon;
        }
        else
        {
          $scope.viceCaptainIcon == false;
        }
      }

}]);