'use strict';
app.directive('addCash',['$localStorage','appDB','$location',function($localStorage,appDB,$location){
  return {
    restrict: 'E',
    controller:'paytmCtrl',
    templateUrl:'Front-End/app/pages/paytm/addCashPopup.html',
    link: function(scope, element, attributes){
      scope.openBolt = function(){
        bolt.launch({
          key: scope.payUData.key,
          txnid: scope.payUData.txnid,
          hash: scope.payUData.hash,
          amount: scope.payUData.amount,
          firstname: scope.payUData.firstname,
          email: scope.payUData.email,
          phone: scope.payUData.phone,
          productinfo: scope.payUData.productinfo,
          surl : scope.payUData.surl,
          furl : scope.payUData.furl,
          lastname : '',
          curl : '',
          address1 : '',
          address2 : '',
          city : '',
          state : '',
          country : '',
          zipcode : '',
          udf1 : '',
          udf2 : '',
          udf3 : '',
          udf4 : '',
          udf5 : '',
          pg : '',
          enforce_paymethod : '',
          expirytime : ''
      },{
    responseHandler: function(get){
      let $data = {};
      $data.login_session_key = $localStorage.userDetails.login_session_key;
      $data.payResponse = JSON.stringify(get.response);
      appDB
      .callPostForm('pay/payuMoneyResponse',$data) 
      .then(
        function success(data){ 
          if(data.code == 200 && data.status == 1){ 
            $location.url('/ac-balance?status=success');
          }
          else
          {
            $location.url('/ac-balance?status=success');
          } 
        },
        function error(data){
          if (data!=null) {         
            $scope.paymentErr=data.message;
            $scope.openPopup('payment_failure');
          }
        }
        );
      
    },
    catchException: function(get){
      alert(get.message);
    }
  });
      }
    }
  };
}]);

app.directive('recentCashdeposit',function(){
  return {
    restrict: 'E',
    controller:'paytmCtrl',
    templateUrl:'Front-End/app/pages/paytm/recentDepositCash.html',
    link: function(scope, element, attributes){
    }
  };
});

app.directive('recentJoinedcontest',function(){
  return {
    restrict: 'E',
    controller:'paytmCtrl',
    templateUrl:'Front-End/app/pages/paytm/recentJoinedContest.html',
    link: function(scope, element, attributes){
    }
  };
});

app.controller('paytmCtrl', ['$scope','$rootScope', '$location', '$window', '$localStorage', 'appDB', 'sportsCollection','$stateParams','$sessionStorage',function($scope,$rootScope, $location, $window, $localStorage, appDB, sportsCollection,$stateParams,$sessionStorage) {
  if($localStorage.isLoggedIn==true){

    // var orderId =$location.search().orderid;
    // var checkstatus =$location.search().checkstatus;
    // var txnstatus=$location.search().txnstatus;
    $scope.coreLogic = Mobiweb.helpers;
    $scope.todayDate = new Date();
    if($sessionStorage.hasOwnProperty('action') && $sessionStorage.action.hasOwnProperty('isFromPaytm') && $sessionStorage.action.isFromPaytm=='1')
    {
      //Get Ready For Redirection
      if($sessionStorage.action.hasOwnProperty('page') && $sessionStorage.action.page!='')
      {
        if($sessionStorage.action.hasOwnProperty('currentSelectedSeries') && typeof $sessionStorage.action.currentSelectedSeries!='undefined')
        {
          $rootScope.currentSelectedSeries = $sessionStorage.action.currentSelectedSeries;
        }
        else
        {
          $rootScope.currentSelectedSeries = $sessionStorage.action.currentSelectedMatchDetails.seriesID;
        }
          $rootScope.currentSelectedMatch = $sessionStorage.action.currentSelectedMatch;
        $rootScope.currentSelectedMatchDetails = $sessionStorage.action.currentSelectedMatchDetails;
        $rootScope.currentSelectedContest = $sessionStorage.action.currentSelectedContest;
        $rootScope.join_type = $sessionStorage.action.join_type;
        if($sessionStorage.action.hasOwnProperty('isChip') && $sessionStorage.action.isChip==true)
        {
          $rootScope.currentSelectedContest.viaChip = {'count':$sessionStorage.action.chipCount};
        }
        if($sessionStorage.action.hasOwnProperty('is_self_contest'))
        {
          $rootScope.self_contest = {'invite_code':$rootScope.currentSelectedContest.user_invite_code,'contest_id':$rootScope.currentSelectedContest.id};
          $rootScope.recentCreatedSelfContest = true;
        }
        let page = $sessionStorage.action.page;
        delete $sessionStorage.action;
        $location.url(page);
      }  
    }
    var txnstatus= $stateParams.txnstatus;
    $scope.payData={};
    $scope.payTmData={};
    $scope.amount=50.00;
    
    $scope.addMoreCash=function(amnt){
      $scope.amount = (!$scope.amount) ? 0 : $scope.amount;
      $scope.amount=Number( $scope.amount)+amnt;
    }
    $scope.selectPaymentMode = function(amount,form){
      if(parseFloat(amount)<50)
      {
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Min limit of adding balance is 50';
        return false;
      }

      $scope.isWalletSubmitted = false;
      if(!form.$valid)
      {
        $scope.isWalletSubmitted = true;
        return false;
      }
      if(parseFloat($scope.amount)>10000)
      {
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Daily add cash limit is Rs 10000, Pls do varification of your KYC to increase limit.';
        return false;
      }
      if($scope.amount<50)
      {
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Min limit of adding balance is 50';
        return false;
      }
      $rootScope.addBalance = {'amount':amount}; 
      $scope.closePopup('add_cash');
      $location.url('/payment-mode');
    }
    $scope.withdramAmount = function(amount,form){

      $scope.isWithdrawSubmitted = false;
      $scope.errorAmount = false;
      $scope.errorAmountMsg = '';
      $scope.successAmount = false;
      $scope.successAmountMsg = '';
      // if($scope.isWithdrawButtonDisabled == 1)
      // {
      //   $scope.errorAmount = true;
      //   $scope.errorAmountMsg = 'First please verify account details';
      //   return false;
      // }
      if(!form.$valid)
      {
        $scope.isWithdrawSubmitted = true;
        return false;
      }
      if($scope.withdrawAmount>25000)
      {
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Max limit of withdraw amount is 25000';
        return false;
      }
      if($scope.withdrawAmount<100)
      {
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Min limit of withdraw amount is 100';
        return false;
      }
      var $data={};
      $data.amount = $scope.withdrawAmount;
      $data.login_session_key = $localStorage.userDetails.login_session_key; 
      appDB
      .callPostForm('user/withdrawal_req',$data) 
      .then(
        function success(data){ 
          if(data.code == 200 && data.status == 1){ 
            $scope.withdrawAmount = '';
            $scope.successAmount = true;
            $scope.successAmountMsg = data.message;
            setTimeout(function(){
              $scope.closePopup('withdrawaAmountPopup');
            },5000);
          }else{
            $scope.errorAmount = true;
            $scope.errorAmountMsg = data.message;
            $scope.withdrawAmount = '';
            return false;
          } 
        },
        function error(data){
          if (data!=null) {         
            $scope.errorAmount = true;
            $scope.errorAmountMsg = data.message;
            $scope.withdrawAmount = '';
            return false;
          }
        }
        );
    }
    $scope.validateAmount = function(){
      $scope.isWalletSubmitted = false;
      $scope.errorAmount = false;
      $scope.errorAmount = '';
      if($scope.amount.match(/^0[0-9].*$/))
      {
          $scope.amount = $scope.amount.replace(/^0+/, '');
      }
      if($scope.amount<50)
      {
          $scope.errorAmount = true;
          $scope.errorAmountMsg = 'Min limit of adding balance is 50';
          return false;
      }
      if($scope.amount>10000)
      {
        $scope.amount = 10000;
        $scope.errorAmount = true;
        $scope.errorAmountMsg = 'Daily add cash limit is Rs 10000, Pls do varification of your KYC to increase limit.';
        return false;
      }
    }
    /*PayU Money Request*/
    $scope.payUReq=function(amount){
      var $data={};
      $data.login_session_key = $localStorage.userDetails.login_session_key; 
      $data.user_id =$localStorage.userDetails.user_id;
      $data.amount = Number(amount);
      $data.firstname = $localStorage.userDetails.name;
      $data.email = $localStorage.userDetails.email;
      $data.phone = $localStorage.userDetails.mobile;
      $scope.isWalletSubmitted=true;
      if($sessionStorage.hasOwnProperty('action') && $sessionStorage.action.hasOwnProperty('currentSelectedContest'))
      {
        $sessionStorage.action.isFromPaytm = '1';
      }
      $scope.payUData = {};
      appDB
      .callPostForm('pay/payUMoneyWeb',$data) 
      .then(
        function success(data){ 
          if(data.code == 200 && data.status == 1){ 
            $scope.payUData=data.response;
            console.log($scope.payUData);
            setTimeout(function(){
              $scope.openBolt();
            },100);
          } 
        },
        function error(data){
          if (data!=null) {         
            $scope.paymentErr=data.message;
            $scope.openPopup('payment_failure');
          }
        }
        );
    }
    /*Paytm Req*/
    $scope.payTmReq=function(amount){
      var $data={};
      $data.login_session_key = $localStorage.userDetails.login_session_key; 
      $data.user_id =$localStorage.userDetails.user_id;
      $data.payment=Number(amount);
      $scope.isWalletSubmitted=true;
      if($sessionStorage.hasOwnProperty('action') && $sessionStorage.action.hasOwnProperty('currentSelectedContest'))
      {
        $sessionStorage.action.isFromPaytm = '1';
      }
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
              $scope.submitPayTmData();
            },100);
          } 
        },
        function error(data){
          if (data!=null) {         
            $scope.paymentErr=data.message;
            $scope.openPopup('payment_failure');
          }
        }
        );
    }

    $scope.submitPayTmData=function(payTmData){
      angular.element('#submitPayTm').trigger('submit')
    }

    $scope.walletData={};
    $scope.isWithdrawButtonDisabled = 1;
    var $data={};
    $scope.walletManagement=function(){
    $data.login_session_key = $localStorage.userDetails.login_session_key; 
    appDB
    .callPostForm('user/account_balance',$data) 
    .then(
      function success(data){ 
        if(data.code == 200 && data.status == 1){ 
          $scope.walletErrMsg="";
          $scope.walletData=data.response;
          $localStorage.totalBalance=data.response.cash.total_balance;
          $localStorage.chipBalance = data.response.chip.total_chip;
          if(data.response.verify_account === 'VERIFIED'){
            $scope.isWithdrawButtonDisabled = 0;
          }else{
            $scope.isWithdrawButtonDisabled = 1;
          }
        } 
      },
      function error(data){
        if (data!=null) {         
          $scope.paymentErr=data.message;
          $scope.openPopup('payment_failure');
        }
      }
      );
  }
  $scope.walletManagement();

  $scope.cashDetails={};
  $scope.depositDetails=function(id){
    $scope.uname= $localStorage.userDetails.name;
    $scope.teamCode= $localStorage.userDetails.team_code;
    var transArray=$scope.walletData.transaction_history;
    for (var i=0; i <  transArray.length; i++) {
      if (transArray[i].id === id) {
        $scope.cashDetails=transArray[i];
        $scope.seriesName=$scope.cashDetails.localteam+"-vs-"+$scope.cashDetails.visitorteam+"-"+$scope.cashDetails.match_type;
      return true;
    }
  }
}
/*Handle ac-balance*/
$scope.userDetails = $localStorage.userDetails;
$scope.hasNext = false;
$scope.currentPage = 1;
/*Handle Transactions*/
/* Cash Transactions*/
$scope.getTransactionType = function(a){
  let type = 'CASH';
  switch(a){
    case 1:
    type = 'CASH';
    break;
    case 2:
    type = 'CASHWITHDRAWAL';
    break;
    case 3:
    type = 'CHIP';
    break;
    case 4:
    type = 'CASHBONUS';
    break;
    default:
    type = 'CASH';
    break;
  }
  return type;
}
$scope.transaction = [];
$scope.currentPage = 1;
$scope.getTransaction = function(){
  $scope.transaction = [];
  let $data = {};
  $data.login_session_key = $localStorage.userDetails.login_session_key;
  $data.limit = 20;
  $data.offset = 0;
  $data.page_no = $scope.currentPage;
  $data.transaction_type = $scope.getTransactionType($scope.activeTransactionTab);
  $data.from_date = $scope.fromDate;
  $data.to_date   = $scope.toDate;
  if($data.transaction_type === 'CASHBONUS'){
    $data.cash_type = $scope.txn_bonus_type;
  }else if($data.transaction_type === 'CASH'){
    $data.cash_type = $scope.cash_txn_type;
  }
  appDB
  .callPostForm('user/transactions_app',$data) 
  .then(
    function success(data){ 
      if(data.code == 200 && data.status == 1){ 
        $scope.transaction=data.response;
        for(var $i=0,len=$scope.transaction.length;$i<len;++$i)
        { 
          let datetime = $scope.transaction[$i].datetime.split(" ");
          $scope.transaction[$i].localdatetime = $scope.coreLogic.getLocalDateTime(datetime[0],datetime[1]);
        }
        $scope.hasNext = data.has_next;
      }
      else if(data.code==200 && data.status == 0)
      {
        $scope.transaction = [];
      } 
    },
    function error(data){
      if (data!=null) {         
        $scope.cashTransaction = [];
      }
    }
    );
}
$scope.showNext = function(){
  $scope.currentPage = parseInt($scope.currentPage)+1;
  $scope.getTransaction();
}
$scope.showPrevious = function(){
  $scope.currentPage = parseInt($scope.currentPage)-1;
  $scope.getTransaction();
}
$scope.activeTransactionTab = 1;
$scope.getTransaction();
$scope.changeTransactionTab = function(b){
  $scope.activeTransactionTab = b;
  $scope.hasNext = false;
  $scope.currentPage = 1;
  $scope.getTransaction();
}

}
}]);