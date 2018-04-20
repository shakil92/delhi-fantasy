app.controller('teamscorecardCtrl',['$scope','$localStorage','$rootScope','$location','sportsCollection','appDB','$window','$sessionStorage','environment','$stateParams',function($scope,$localStorage,$rootScope,$location,sportsCollection,appDB,$window,$sessionStorage,environment,$stateParams){
        let stateparam = $stateParams;
        if(stateparam.seriesid==null || stateparam.matchid ==null)
        {
            $location.url('/contest');
        }
        let $data = {};
        $data.login_session_key = $localStorage.userDetails.login_session_key;
        $data.series_id = stateparam.seriesid;
        $data.match_id = stateparam.matchid;
        $data.team_id = stateparam.teamid;
        $data.user_id = stateparam.userid;
        $data.contest_id = stateparam.contestid;
        appDB
        .callPostForm('live/team_player_score_point',$data) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.player_details=data.response;
                } 
            },
            function error(data){
                if (data!=null) {					
                    $scope.seriesErrMsg=data.message;
                }
            }
        );
        appDB
        .callPostForm('match/matche_detail',$data) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.match_details = data.response;
                } 
            },
            function error(data){
                if (data!=null) {					
                    $scope.seriesErrMsg=data.message;
                }
            }
        );
    }]);