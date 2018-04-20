'use strict';
app.directive('joinButton',['$rootScope','$compile',function($rootScope,$compile){
  return {
    restrict: 'E',
    controller:'joinCtrl',
    scope:{
        condetails: '=',
        hasteam: '=',
        totalBalance: '=joinTotalBalance',
        chipBalance: '=joinChipBalance'
    },
    transclude: true,
    templateUrl:'Front-End/app/pages/join/joinButton.html',
    link: function(scope, element, attributes){
      scope.teamCount     = 0;
      scope.$watch('hasteam',function(newValue,oldValue){
           scope.teamCount = newValue;
      });
      
    }
  };
}]);

app.directive('joinContest',['$compile','$localStorage','appDB',function($compile,$localStorage,appDB){
  return {
    restrict: 'E',
    controller:'joinContestCtrl',
    scope : {
        createdteam : '=',
        selecteduserteam: '=showSelectedTeam',
        accountbalance : '=joinTotalBalance',
        accountchipbalance : '=joinChipBalance',
        selectedcontest: "=contest",
        currentselectedmatch : "=currentSelectedMatch"
    },
    transclude:true,
    templateUrl:'Front-End/app/pages/join/joinContest.html',
    link : function(scope, element, attributes){
        $('select#joinSelectedTeam').eq(0).remove();
        /*Handle Set Team Count*/
         scope.$on("setTeamCount", function (evt, data,current_team) {
            scope.teamCount = data;
            scope.current_team = current_team;
        });
        /*Join Contest*/
        scope.$watch('selecteduserteam',function(){
            if(scope.selecteduserteam!=undefined && scope.selecteduserteam.hasOwnProperty('currentSelectedTeam'))
            {
                scope.join.selected = scope.selecteduserteam.currentSelectedTeam;
            }
        })
       
    }
  }
}]);

app.controller('joinContestCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$compile','$sessionStorage',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$compile,$sessionStorage){
        
    $scope.join = {};
    
    $scope.$on('current_contest_emit',function(event,data,openJoinPopup){
        $scope.current_contest = data;
        if(parseInt($scope.current_contest.contest_size)<=parseInt($scope.current_contest.total_join_team))
        {
           $scope.$parent.openPopup('contest_fullfilled');
           return false;
        }
        if($scope.current_team==0)
        {
            $rootScope.$broadcast('action_record','create-team',data);
            $scope.$parent.openPopup('check_team');
            return false; 
        }
        /*Logic to Handle MultiJoin Contest*/
        if($scope.current_contest.hasOwnProperty('joining'))
        {
            if(parseFloat($scope.current_contest.display_join_amount)==parseFloat($scope.current_contest.joining.chip)+parseFloat($scope.current_contest.joining.cash))
            {
               $scope.$parent.openPopup('selectTeamChips');
               return false; 
            }
        }
        if(parseInt($scope.current_contest.chip)==0) // Pure Cash Contest
        {
            if(parseFloat($scope.current_contest.team_entry_fee)>parseFloat($scope.accountbalance))
            {   $scope.amount = $scope.current_contest.team_entry_fee-$scope.accountbalance;
                $scope.$parent.openPopup('not_enough_cash');
            }
            else
            {
                $scope.$parent.openPopup('selectTeam'); 
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
           $scope.$parent.openPopup('add_chips');
          }
       
        
    });
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
        if($scope.amount>25000 || $scope.amount<1)
        {
            $scope.amount = $scope.current_contest.team_entry_fee;
            $scope.errorAmount = true;
            $scope.errorAmountMsg = 'Max limit of adding balance is 25000 and min limit is 0';
            return false;
        }
    }
    $scope.submitPaytm = function(amount,form,isChip){
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
        $sessionStorage.action = {'isFromPaytm':'0','page':'contest','currentSelectedSeries':$scope.$parent.currentSelectedSeries,'currentSelectedMatch':$scope.$parent.currentSelectedMatch,'currentSelectedMatchDetails':$scope.$parent.currentSelectedMatchDetails,'currentSelectedContest':$scope.current_contest,'join_type':'join','amount':amount};
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
    /*To Capture Action Recorded*/
    $scope.$on('action_record',function(event,action,data){
        $rootScope.recordedAction = {'action':action,'data':data};
    });
    /*To Show Invite Code*/
    $scope.$on('showInvitePopupE',function(event,data){
        $scope.current_invite_code = data;
        $scope.$parent.openPopup('common_invite_code');
    });
    /*To Play As Per Recorded Action*/
    $scope.joinDisabled = false;
    $scope.dismissPopup = function(id)
    {
        $scope.$parent.closePopup(id);
    }
    $scope.selectTeamChips = function(contest,amount,chip)
    {   contest.joining = {};
        contest.joining.cash = amount;
        contest.joining.chip = chip;
        $scope.$parent.closePopup('add_chips');
        $rootScope.$broadcast('current_contest_emit',contest);   
        
    }
    /*Join Contest Action Handler*/
    $scope.joinContestNow = function(){
        let $data = {};
        $scope.joinDisabled = true;
        $data.login_session_key = $localStorage.userDetails.login_session_key; 
        $data.user_id =$localStorage.userDetails.user_id;
        $data.joining_amount = $scope.current_contest.team_entry_fee;
        $data.user_team_id = $scope.join.selected;
        $data.match_id = $scope.currentselectedmatch;
        $data.contest_id = $scope.current_contest.id;
        $data.chip = 0;
        if($scope.current_contest.hasOwnProperty('joining'))
        {
            $data.joining_amount = $scope.current_contest.joining.cash;
            $data.chip = $scope.current_contest.joining.chip;
        }
        $scope.selfCreatedContest = false;
        $scope.self_contest = {};
        appDB
        .callPostForm('contest/join_contest',$data) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.joinDisabled = false;
                    $scope.$emit('joinedContest',$scope.current_contest);
                    $rootScope.$broadcast('updateBalanceEvent');
                    $scope.$parent.closePopup('selectTeam');
                    if($scope.current_contest.hasOwnProperty('joining'))
                    {
                        $scope.$parent.closePopup('selectTeamChips');
                    }
                    if($rootScope.hasOwnProperty('self_contest') && $rootScope.self_contest.contest_id==$data.contest_id)
                    {
                     $scope.selfCreatedContest = true;
                     $scope.self_contest = $rootScope.self_contest;
                     delete $rootScope.recentCreatedSelfContest;
                     delete $rootScope.self_contest; 
                     $scope.openPopup('invite_code')  
                    }
                    else
                    {
                      $scope.openPopup('suss_msg');
                    }
                }
                
        },
        function error(data){
            if (data!=null) {         
              $scope.joinError = {};
              $scope.joinError.status = true;
              $scope.joinError.message = data.message;
            }
            $scope.joinDisabled = false;
        });
    }
    $scope.addMoreCash = function(amount){
        $scope.amount = (!$scope.amount) ? 0 : $scope.amount;
        $scope.amount = parseFloat($scope.amount)+parseFloat(amount);
    }
    
 }]);


app.controller('joinCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$compile',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$compile){
    $scope.current_contest = {};
    $scope.joinContestData = {};
    

    $scope.joinContestDetails = function(contest){
        if(parseInt(contest.contest_size)<=parseInt(contest.total_join_team))
        {
           $scope.$parent.openPopup('contest_fullfilled');
           return false;
        }
        $rootScope.$broadcast('current_contest_emit',contest);
    }
    if($rootScope.hasOwnProperty('currentSelectedContest') && $rootScope.hasOwnProperty('join_type') && $rootScope.join_type == 'join')
    {
        $scope.joinContestDetails($rootScope.currentSelectedContest);
        delete $rootScope.currentSelectedContest;
    }
    $scope.joinContestPayTmReq=function(amount){
        var $data={};
        $data.login_session_key = $localStorage.userDetails.login_session_key; 
        $data.user_id =$localStorage.userDetails.user_id;
        $data.payment=Number(amount);
        $scope.isValiDate=false;
        if (amount=="" || amount==0) {
            return false;
        }else{
            $scope.isValiDate=true;
            appDB
            .callPostForm('pay/payTm',$data) 
            .then(
                function success(data){ 
                    if(data.code == 200 && data.status == 1){ 
                    $scope.payData=data.response;
                    $scope.payErrMsg="";
                    $scope.MID=$scope.payData.MID;
                    $scope.ORDER_ID=$scope.payData.ORDER_ID;
                    $scope.CHANNEL_ID=$scope.payData.CHANNEL_ID;
                    $scope.CHECKSUMHASH=$scope.payData.CHECKSUMHASH;
                    $scope.CUST_ID=$scope.payData.CUST_ID;
                    $scope.INDUSTRY_TYPE_ID=$scope.payData.INDUSTRY_TYPE_ID;
                    $scope.WEBSITE=$scope.payData.WEBSITE;
                    $scope.TXN_AMOUNT=$scope.payData.TXN_AMOUNT;
                    $scope.CALLBACK_URL=$scope.payData.CALLBACK_URL;
                    setTimeout(function(){
                        $scope.joinSubmitPayTmData();
                    },10);
                } 
            },
            function error(data){
                if (data!=null) {         
                    $scope.payErrMsg=data.message;
                }
            });
        }
    }
    $scope.joinSubmitPayTmData=function(payTmData){
      angular.element('#joinSubmitPayTm').trigger('submit')
    }
    $scope.selectTeam = function(contest){
        if(parseInt(contest.contest_size)<=parseInt(contest.total_join_team))
        {
           $scope.$parent.openPopup('contest_fullfilled');
           return false;
        }
        $rootScope.$broadcast('current_contest_emit',contest);
    }
    
    $scope.createContest = function(){
        if($scope.current_team!=0 && typeof $scope.current_team!='undefined')
        {
            $scope.$parent.openPopup('creat_contest'); 
        }
        
    }
    $scope.checkTeam = function(contest){
        if(parseInt(contest.contest_size)<=parseInt(contest.total_join_team))
        {
           $scope.$parent.openPopup('contest_fullfilled');
           return false;
        }
        $rootScope.$broadcast('action_record','create-team',contest);
        $scope.$parent.openPopup('check_team'); 
    }
    
    $scope.$on("setTeamCount", function (evt,data,current_team) {
        $scope.teamCount = data;
        $scope.current_team = current_team;
        if($rootScope.hasOwnProperty('recordedAction'))
        {
            let actionObj = $rootScope.recordedAction;
            switch(actionObj.action)
            {
                case 'self-contest-join':
                $scope.selectTeam(actionObj.data);
                delete $rootScope.recordedAction;
                break;
                case 'create-contest':
                $scope.createContest();
                delete $rootScope.recordedAction;
                break;
                case 'create-team':
                $scope.selectTeam(actionObj.data);
                delete $rootScope.recordedAction;
                break;
            }
            
        }
    });

    $scope.showInvitePopup = function(contest){
        let current_invite_code = contest.contest_join_code;
        $rootScope.$broadcast('showInvitePopupE',current_invite_code);
    }   
}]);