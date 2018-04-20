app.controller('settingsCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB','$filter','environment',function($scope,$rootScope,$location,$window,$localStorage,appDB,$filter,environment){
    $scope.env = environment; 

   
    switch($location.path())
	{
		case '/mobileverification': 
		$scope.currentSetting='mobileverification';
        break;
        case '/settings': 
		$scope.currentSetting='settings';
        break; 
        case '/pan-card': 
		$scope.currentSetting='pan-card';
        break;
        case '/aadhar-card': 
        $scope.currentSetting='aadhar-card';
        case '/verify-email': 
		$scope.currentSetting='emailVerification';
        break;
        default:
        $scope.currentSetting='settings';
        
    }
    var d = new Date();
	var year = d.getFullYear() - 18;
	$scope.date=d.setFullYear(year);
	$scope.dobValidate=d;
    /*Fetch Profile Details*/
    $scope.profileFetchDetails = function(){
        let $data = {};
        $data.login_session_key = $localStorage.userDetails.login_session_key;
        appDB
		.callPostForm('user/profile_details',$data) 
		.then(
			function success(data){ 
				
				if(data.code == 200 && data.status == 1){ 
					$scope.users = data.response;      
					$rootScope.$broadcast('getUserDetail',$scope.users);
				} 
				else if(data.status ==2)
				{
					$scope.logout();
					return false;
				}
				storedCountry=data.response.country;
			},
			function error(data){ 
				$scope.errorMsg = '*'+data.message; 
				$scope.errorStatus = 1; 

			}
		);
    }
    /*Account Details Update*/
    $scope.settings = {};
    $scope.$on('getUserDetail',function(event,data){
        $scope.settings.name = data.name;
        $scope.settings.state = data.state;
        $scope.isReadOnly = false;
        
        if(data.hasOwnProperty('bank_account'))
        {
            $scope.settings.name = data.bank_account.name;
            $scope.settings.account_number = data.bank_account.account_number;
            $scope.settings.account_number_confirm = data.bank_account.account_number;
            $scope.settings.ifsc = data.bank_account.ifsc_code;
            $scope.settings.account_file = data.bank_account.account_file;
            $scope.settings.account_details_id = data.bank_account.id;
            $scope.settings.bank_name = data.bank_account.bank_name;
            $scope.settings.branch_name = data.bank_account.branch_name;
                 
        }
        if(data.hasOwnProperty('pan_card'))
        {
            $scope.settings.name = data.bank_account.name;
            $scope.settings.pan_number = data.pan_card.pan_number;
            $scope.settings.date_of_birth = data.pan_card.date_of_birth;
            $scope.settings.date_of_birth = $filter('date')(new Date($scope.settings.date_of_birth), "dd-MM-yyyy"); 
            if($scope.hasOwnProperty('users') && $scope.users.hasOwnProperty('date_of_birth'))
            {
                $scope.users.date_of_birth = $scope.settings.date_of_birth;
                
            }
            $scope.settings.state = data.pan_card.state_id;
            $scope.settings.pan_details_id = data.pan_card.id;
            
        }
        if(data.hasOwnProperty('aadhar_card'))
        {
            $scope.settings.name = data.aadhar_card.name;
            $scope.settings.aadhar_number = data.aadhar_card.aadhar_number;
            $scope.settings.date_of_birth = data.aadhar_card.date_of_birth;
            $scope.settings.date_of_birth = $filter('date')(new Date($scope.settings.date_of_birth), "dd-MM-yyyy"); 
            if($scope.hasOwnProperty('users') && $scope.users.hasOwnProperty('date_of_birth'))
            {
                $scope.users.date_of_birth = $scope.settings.date_of_birth;
            }
            $scope.settings.state = data.aadhar_card.state_id;
            $scope.settings.aadhar_details_id = data.aadhar_card.id;
            
        }
        if(data.hasOwnProperty('mobile') && data.mobile!='' && data.mobile_verify=='1')
        {
            $scope.settings.mobile = data.mobile;
        }
        switch($scope.currentSetting)
        {
            case 'mobileverification': 
                if(data.mobile_verify=='1')
                {
                    $scope.isReadOnly = true;
                }
                else
                {
                    $scope.isReadOnly = false;
                }
            break;
            case 'settings': 
                if(data.account_verify=='2')
                {
                    $scope.isReadOnly = true;
                }
                else
                {
                    $scope.isReadOnly = false;
                }
            break; 
            case 'pan-card': 
                if(data.pancard_verify=='2')
                {
                    $scope.isReadOnly = true;
                }
                else
                {
                    $scope.isReadOnly = false;
                }
            break;
            case 'aadhar-card': 
                if(data.aadhar_verify=='2')
                {
                    $scope.isReadOnly = true;
                }
                else
                {
                    $scope.isReadOnly = false;
                }
            break;
            default:
            $scope.isReadOnly = false;
            
        }
    });
  
    $scope.updateBankAccount = function(form){
        $scope.resetError();
        $scope.submitted = true;
        if(!form.$valid)
        {
            return false;
        }
        if($scope.settings.account_number!=$scope.settings.account_number_confirm)
        {
            return false;
        }
        var fd = new FormData();
        fd.append('login_session_key',$localStorage.userDetails.login_session_key);
        fd.append('name',$scope.settings.name);
        fd.append('account_number',$scope.settings.account_number);
        fd.append('ifsc_code',$scope.settings.ifsc);
        fd.append('bank_name',$scope.settings.bank_name);
        fd.append('branch_name',$scope.settings.branch_name);
        if($scope.settings.hasOwnProperty('account_details_id'))
        {
            fd.append('id',$scope.settings.account_details_id);
        }
        if ($scope.settings.picFile != null) {
        fd.append('account_file', $scope.settings.picFile);
           appDB
            .callPostImage('user/verify_bank_account',fd) 
            .then(
                function success(data){ 
                    if(data.code == 200 && data.status == 1){ 
                        $scope.success = true;
                        $scope.successMsg = data.message;
                        $scope.profileFetchDetails();
                    }
                    else
                    {

                        if(data.hasOwnProperty('message'))
                        {   $scope.error = true;
                            $scope.errorMsg = data.message;
                        }
                        
                    } 
                },
                function error(data){ 
                    if(data.hasOwnProperty('message'))
                    {   $scope.error = true;
                        $scope.errorMsg = data.message;
                    }
                }
                );
         
        }
    }
    $scope.resetError = function(){
        $scope.success = false;
        $scope.error = false;
        $scope.successMsg = '';
        $scope.errorMsg = '';
       
    }
    $scope.updateAdhar = function(form){
        $scope.resetError();
        $scope.submitted = true;
        if(!form.$valid)
        {
            return false;
        }
        var fd = new FormData();
        fd.append('login_session_key', $localStorage.userDetails.login_session_key);
        fd.append('aadhar_number',$scope.settings.aadhar_number);
        fd.append('name',$scope.settings.name);
        /*Handle Date for Requested Format*/
        var dateString = $scope.settings.date_of_birth;
        var dateParts = dateString.split("-");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        let dob = $filter('date')(dateObject, "yyyy-MM-dd");
        fd.append('date_of_birth',dob);
        
        fd.append('state', $scope.settings.state);
        if($scope.settings.hasOwnProperty('aadhar_details_id'))
        {
            fd.append('id',$scope.settings.aadhar_details_id);
        }
        if ($scope.settings.picFile != null) {
        fd.append('aadhar_file', $scope.settings.picFile);
        appDB
        .callPostImage('user/verify_aadhar_card',fd) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.success = true;
                    $scope.successMsg = data.message;
                    $scope.profileFetchDetails();
                }

            },
            function error(data){ 
                if(data.hasOwnProperty('message'))
                {   $scope.error = true;
                    $scope.errorMsg = data.message;
                }
            }
            );
        }   
    }
    /*Update PAN Card*/
    $scope.updatePANCard = function(form){
        $scope.resetError();
        $scope.submitted = true;
        if(!form.$valid)
        {
            return false;
        }
        if($scope.settings.account_number!=$scope.settings.account_number_confirm)
        {
            return false;
        }
        var fd = new FormData();
        fd.append('login_session_key',$localStorage.userDetails.login_session_key);
        fd.append('name',$scope.settings.name);
         /*Handle Date for Requested Format*/
        var dateString = $scope.settings.date_of_birth;
        var dateParts = dateString.split("-");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        let dob = $filter('date')(dateObject, "yyyy-MM-dd");
        fd.append('date_of_birth',dob);
         
        fd.append('pan_number',$scope.settings.pan_number);
        fd.append('state',$scope.settings.state);
        fd.append('country',$scope.users.country);
        if($scope.settings.hasOwnProperty('pan_details_id'))
        {
            fd.append('id',$scope.settings.pan_details_id);
        }

        if ($scope.settings.picFile != null) {
        fd.append('pan_card_file', $scope.settings.picFile);
           appDB
            .callPostImage('user/verify_pan_card',fd) 
            .then(
                function success(data){ 
                    if(data.code == 200 && data.status == 1){ 
                        $scope.success = true;
                        $scope.successMsg = data.message;
                        $scope.profileFetchDetails();
                    }
                    else
                    {

                        if(data.hasOwnProperty('message'))
                        {   $scope.error = true;
                            $scope.errorMsg = data.message;
                        }
                        
                    } 
                },
                function error(data){ 
                    if(data.hasOwnProperty('message'))
                    {   $scope.error = true;
                        $scope.errorMsg = data.message;
                    }
                }
                );
         
        }
    }
    $scope.isOTPSend = false;
    $scope.verifyMobile = function(form){
        $scope.resetError();
        $scope.submitted = true;
        if(!form.$valid)
        {
            return false;
        }
        var fd = {};
        fd.login_session_key= $localStorage.userDetails.login_session_key;
        fd.mobile=$scope.settings.mobile;
        appDB
        .callPostForm('user/mobile_send_verification_otp',fd) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.success = true;
                    $scope.successMsg = data.message;
                    $scope.isOTPSend = true;
                    $scope.submitted = false;
                } 
            },
            function error(data){ 
                if(data.hasOwnProperty('message'))
                {   $scope.error = true;
                    $scope.errorMsg = data.message;
                    $scope.isOTPSend = false;
                    $scope.submitted = false;
                }
            }
            );

    }
    $scope.verifyMobileOTP = function(form){
        $scope.resetError();
        $scope.submitted = true;
        if(!form.$valid)
        {
            return false;
        }
        var fd = {};
        fd.login_session_key= $localStorage.userDetails.login_session_key;
        fd.otp = $scope.settings.mobileNumberOtp;
        appDB
        .callPostForm('user/mobile_verify_otp',fd) 
        .then(
            function success(data){ 
                if(data.code == 200 && data.status == 1){ 
                    $scope.success = true;
                    $scope.successMsg = data.message;
                    $scope.isOTPSend = false;
                    $scope.profileFetchDetails();
                } 
            },
            function error(data){ 
                if(data.hasOwnProperty('message'))
                {   $scope.error = true;
                    $scope.errorMsg = data.message;
                    $scope.isOTPSend = true;
                    
                }
            }
            );

    }

    /*to verify email*/
    $rootScope.sendVeify=true;
    $scope.emailData = [];
    $scope.errorMsg=""; 
    $scope.sendVerificationCode = function(email,via){  
        if ($rootScope.sendVeify==true || via==2) {
            $rootScope.sendVeify=false;
            var data={};
            data.login_session_key = $localStorage.userDetails.login_session_key;
            data.email=$localStorage.userDetails.email;
            appDB
            .callPostForm('/user/email_verification_link',data) 
            .then(
                function success(data){ 
                    if(data.code == 200 && data.status == 1){ 
                        $scope.emailData = data.response;  
                        $scope.msg ="Verification code has been sent to your email-id, Enter the code on below field!"; 
                        $scope.errorMsg=""; 
                    } 
                },
                function error(data){ 
                    if(data.status == 0){ 
                        $scope.errorMsg ='*'+data.message+'.';  
                        $scope.msg="";
                    } 
                }
                );
        } 
        else{
            $scope.msg ="";
        }   
    }

 }]);