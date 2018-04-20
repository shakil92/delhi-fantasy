'use strict';

app.directive('customAccordion',function(){
    return {
     restrict: 'A',
     link: function(scope, element, attributes){
        $('.panel a').click(function(){
            var _that = $(this);
            $('.panel a').attr('aria-expanded','false').addClass('collapsed');
            $('.panel-collapse').removeClass('in');
            _that.attr('aria-expanded','true').removeClass('collapsed');
            _that.closest('.panel').find('.panel-collapse').addClass('in');
        });
    }
   };
});

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
   
app.controller('predictionCtrl',['$scope','$localStorage','$rootScope','$location','appDB','$sce','socialLoginService','$window','environment',function($scope,$localStorage,$rootScope,$location,appDB,$sce,socialLoginService,$window,environment){
	
	if($localStorage.hasOwnProperty('isLoggedIn') && $localStorage.isLoggedIn==true)
	{
		$scope.isLoggedIn = true;
	}
	else
	{
		$scope.isLoggedIn = false;
	}
    $scope.env = environment;
	$scope.isSalaryCap = false;


    $scope.getLastUrlSegment = function(){
       return window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    }

    /* Get macth details */
    $scope.getMatchDetails=function(){
        $('.modal-backdrop').remove();
        var $data={};
        var teamData = new Array();
        $data.login_session_key = (!$localStorage.userDetails) ? '' : $localStorage.userDetails.login_session_key; 
        if(!$data.login_session_key) return false;
        $data.match_id = $scope.getLastUrlSegment(); 
        appDB
        .callPostForm('match/matche_detail',$data) 
        .then(
          function success(data){ 
            if(data.code == 200 && data.status == 1){ 
              teamData.push({teamId:data.response.localteam_id,teamName:data.response.localteam_name});
              teamData.push({teamId:data.response.visitorteam_id,teamName:data.response.visitorteam_name});
              $scope.localteam_image = data.response.localteam_image;
              $scope.visitorteam_image = data.response.visitorteam_image;
              $scope.teamData = teamData;
              $scope.matchCounter(data.response.match_date_time);
              $scope.getMatchPlayers(data.response.series_id,data.response.localteam_id,data.response.visitorteam_id,$data.match_id);
            } 
          },
          function error(data){
            if (data!=null) {         
            }
          }
          );
    };
    $scope.getMatchDetails();

    /* Get my predictions list */
    $scope.getMyPredictions=function(){
        var $data={};
        $data.login_session_key = (!$localStorage.userDetails) ? '' : $localStorage.userDetails.login_session_key; 
        if(!$data.login_session_key) return false;
        appDB
        .callPostForm('match/my_prediction',$data) 
        .then(
          function success(data){ 
            if(data.code == 200 && data.status == 1){ 
              $scope.myPredictions = data.response;
            } 
          },
          function error(data){
            if (data!=null) {         
            }
          }
          );
    };

    /* Get prediction details */
    $scope.getPredictionDetails=function(){
        var $data={};
        $data.login_session_key = (!$localStorage.userDetails) ? '' : $localStorage.userDetails.login_session_key; 
        $data.user_id = (!$localStorage.userDetails) ? 0 : $localStorage.userDetails.user_id; 
        if(!$data.login_session_key) return false;
        $data.match_id = $scope.getLastUrlSegment(); 
        appDB
        .callPostForm('match/match_prediction_result',$data) 
        .then(
          function success(data){ 
            if(data.code == 200 && data.status == 1){ 
              $scope.questionsData = data.response.question_predict;
               $scope.localteam_image = data.response.match_detail.localteam_image;
               $scope.visitorteam_image = data.response.match_detail.visitorteam_image;
               $scope.matchCounter(data.response.match_detail.match_date_time);
            } 
          },
          function error(data){
            if (data!=null) {      
            }
          }
          );
    };

    $scope.manage_salary_cap = function(){
        $scope.isSalaryCap = true;
        let runs = (!$scope.win_by_runs) ? 0 : parseInt($scope.win_by_runs);
        let cap  =  runs + 5;
        $scope.win_by_runs_cap = runs + " - " + cap;
    }

    /* Manage match counter */
    $scope.matchCounter=function(matchTime){

        var countDownDate = new Date(matchTime).getTime();
        
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
                $scope.$apply();
            }, 1000);
    }

    $scope.getStarted = function(){
        $('html, body').animate({
            scrollTop: $(".match_information").offset().top
        }, 500);
    }

    /* Get match players */
    $scope.getMatchPlayers=function(series_id,localteam_id,visitorteam_id,match_id){
        var $data={};
        var player_select_11_player_from_a = new Array();
        var player_select_11_player_from_b = new Array();
        var matchPlayers = new Array();
        $data.login_session_key = $localStorage.userDetails.login_session_key; 
        $data.series_id = series_id; 
        $data.localteam_id = localteam_id; 
        $data.visitorteam_id = visitorteam_id; 
        $data.match_id = match_id; 
        appDB
        .callPostForm('match/team_match_player',$data) 
        .then(
          function success(data){ 
            if(data.code == 200 && data.status == 1){ 
                let local_team_player   = data.local_team_player;
                let visitor_team_player = data.visitor_team_player;
                for (var i = 0; i < local_team_player.length; i++) 
                {
                    player_select_11_player_from_a.push(local_team_player[i].player_id);
                    matchPlayers.push({player_id:local_team_player[i].player_id,name:local_team_player[i].name})
                }

                for (var j = 0; j < visitor_team_player.length; j++) 
                {
                    player_select_11_player_from_b.push(visitor_team_player[j].player_id);
                    matchPlayers.push({player_id:visitor_team_player[j].player_id,name:visitor_team_player[j].name})
                }
                $scope.matchPlayers = matchPlayers;
                $scope.player_select_11_player_from_a = player_select_11_player_from_a;
                $scope.player_select_11_player_from_b = player_select_11_player_from_b;
            } 
          },
          function error(data){
            if (data!=null) {         
            }
          }
          );
    };

    /* To submit prediction */
    $scope.submitPrediction = function(form) {

        $scope.predictionSuccess = false;
        $scope.predictionSuccessMsg = '';
        $scope.predictioError = false;
        $scope.predictioErrorMsg = '';
        var $data={};
        $data.login_session_key = $localStorage.userDetails.login_session_key; 
        $data.user_id = $localStorage.userDetails.user_id; 
        $data.match_id = $scope.getLastUrlSegment(); 
        $data.win_by_runs = $scope.win_by_runs; 
        $data.win_by_wicket = $scope.win_by_wicket; 
        $data.man_of_the_match = $scope.man_of_the_match; 
        $data.maximum_six_by_plyer = $scope.maximum_six_by_plyer; 
        $data.maximum_wicket_by_plyer = $scope.maximum_wicket_by_plyer; 
        $data.maximum_four_by_player = $scope.maximum_four_by_player; 
        $data.total_clean_bold_wicket = $scope.total_clean_bold_wicket; 
        $data.total_run_scored_by_opening_team = $scope.total_run_scored_by_opening_team; 
        $data.total_number_of_catch_out_for_the_day = $scope.total_number_of_catch_out_for_the_day; 
        $data.winner_team_of_the_day = $scope.winner_team_of_the_day; 
        $data.player_select_11_player_from_a = JSON.stringify($scope.player_select_11_player_from_a); 
        $data.player_select_11_player_from_b = JSON.stringify($scope.player_select_11_player_from_b); 
        appDB
        .callPostForm('match/match_prediction',$data) 
        .then(
          function success(data){ 
            if(data.code == 200 && data.status == 1){ 
                $scope.predictionSuccess = true;
                $scope.predictionSuccessMsg = 'Contest Pre Prediction submitted successfully.';
                setTimeout(function(){
                    $location.path('#/contest');
                },2000);
            }else{
                $scope.predictioError = true;
                $scope.predictioErrorMsg = data.message;
            }
          },
          function error(data){
            if (data!=null) {    
                $scope.predictioError = true;
                $scope.predictioErrorMsg = data.message;     
            }
          }
          );
    };

	
}]);