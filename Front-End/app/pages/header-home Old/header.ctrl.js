'use strict';
app.directive('headerHome',function(){
	return {
		restrict: 'E',
		controller:'headerCtrl',
		templateUrl:'Front-End/app/pages/header-home/header.html',
		link: function(scope, element, attributes){
			/*Mobile Menu Handle*/
			scope.$watch('isShowSideBarMobile',function(newVal,oldVal){
				if(newVal==true)
				{
					$('body').addClass('open-menu');
				}
				else
				{
					$('body').removeClass('open-menu');
				}
			})
			scope.applyBannerSlider = function(){
				$('.bannerSlider').slick({
					dots: false,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: true,
					autoplaySpeed: 2000,
					arrows: false,
					loop: true,
				});
				}

		}
	};
});
app.directive('verifyEmail',function(){
	return {
		restrict: 'E',
		controller:'uerProfileCtrl',
		templateUrl:'Front-End/app/pages/header-home/verifyEmail.html',
		link: function(scope, element, attributes){
		}
	};
});

app.directive('changePassword',function(){
	return {
		restrict: 'E',
		controller:'uerProfileCtrl',
		templateUrl:'Front-End/app/pages/header-home/changePassword.html',
		link: function(scope, element, attributes){
		}
	};
});

app.controller('uerProfileCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB','environment',function($scope,$rootScope,$location,$window,$localStorage,appDB,environment){
	$scope.emailData = [];
	$scope.totalBalance=$localStorage.totalBalance;
	$scope.signupType=$localStorage.signupType;
	/*Send verification code for verifying Email-Id*/
	$rootScope.sendVeify=true;
	$scope.env = environment;
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
	/*Enter verification code then verify Email-Id*/
	$scope.verifiedData=[];
	$scope.verifyEmailId = function(){  
		var data={};
		data.email=$localStorage.userDetails.email;
		data.vCode=$scope.verificationCode;
		$scope.isVerified=true;
		appDB
		.callPostForm('/user/verify_code_email',data) 
		.then(
			function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.verifiedData = data.response; 
					$scope.msg="You have successfully verified your email id!"; 
					$scope.isEmailVerified=1;
					$localStorage.userDetails.email_verify=1;
					$scope.errorMsg="";
				} 
				setTimeout(function(){  
					$scope.closePopup("verify_email");
				}, 3000);
			},
			function error(data){ 
				if(data.status == 0){ 
					$scope.msg="";
					$scope.errorMsg ='*'+data.message+'.';  
				} 
			}
			);
	}
	/*Hide Server Side Massage */
	$scope.hideShowMsg = function(){       
		$scope.showMsg = false;
		$scope.isSubmitted = false;
	}

 $scope.clearPasswordPopup = function(){
      $scope.currentPass = '';
      $scope.newPass = '';
      $scope.confirmPass ='';
      $scope.isSubmitted = false;
      $scope.updateMsg = false;
      $scope.closePopup("updatePassword");
    }
	/*Change Password*/
	$scope.updatePassword=[];
	$scope.changePassword = function(createform1){  
          $scope.helpers = Mobiweb.helpers;
	 $scope.updateMsg = false;
      $scope.isSubmitted = true;
      if(!createform1.$valid)
      {
        return false;
      }
		var data={};
		$scope.errorMsg="";
		$scope.showMsg=false; 
		data.login_session_key=$localStorage.userDetails.login_session_key;
		data.current_password=$scope.currentPass;
		data.new_password=$scope.newPass;
		data.confirm_password=$scope.confirmPass;
		$scope.isSubmitted = true;
		appDB
		.callPostForm('/user/change_password',data) 
		.then(
			function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.updatePassword = data.response;  
					$scope.updateSuccess ="Your password has been updated successfully!";  
					$scope.errorMsg=""; 
                    $scope.updateMsg = true; 
					setTimeout(function(){  
						$scope.clearPasswordPopup();
					}, 2000);

				} 
			},
			function error(data){ 
				if(data.status == 0){ 
					if ($scope.currentPass!=undefined && $scope.newPass!=undefined && $scope.confirmPass!=undefined){
						$scope.errorMsg = '*'+data.message+'.'; 
						$scope.showMsg=true; 
					}
					$scope.msg="";
				} 
			}
			);
	}

}]);


app.controller('headerCtrl',['$scope','$rootScope','$location','$window','$localStorage','appDB','$filter','Upload','environment','$http','$sessionStorage','$timeout',function($scope,$rootScope,$location,$window,$localStorage,appDB,$filter,Upload,environment,$http,$sessionStorage,$timeout){
	$scope.showMeContest=true;
	var path = $location.$$path;
	if(typeof $localStorage.userDetails=='undefined')
	{
		$location.url('/login');
		return false;
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

	$scope.isLoggedIn = $localStorage.isLoggedIn;
	$scope.userDetails = $localStorage.userDetails;
	$scope.env = environment;
	/*Count 18 years from today- start*/
	var d = new Date();
	var year = d.getFullYear() - 18;
	$scope.date=d.setFullYear(year);
	$scope.dobValidate=d; 
	/*Count 18 years from today- end*/
	
	if ($localStorage.userDetails!=undefined) {
		$scope.isEmailVerified=$localStorage.userDetails.email_verify;
	}
	if ($localStorage.userDetails!=undefined) {
		var $data = {};
		$data.login_session_key = $localStorage.userDetails.login_session_key;   
	}

	/* Verify PAN card with a few details*/
	$scope.verifyPanCard = function($data){
		var login_session_key=$localStorage.userDetails.login_session_key;
		$data.full_name=$scope.pc.full_name;
		$data.pan_number=$scope.pc.pan_number;
		$data.date_of_birth=$scope.pc.date_of_birth;
		// $data.state=$scope.pc.state;
		$data.state=11;
		$data.login_session_key=login_session_key;
		var file=$scope.file;
		var newFile= new File([file], file.$ngfName,{type:file.type});
		var name=file.$ngfName;
		var type=file.type;
		var size=file.size;

		// var newFile={};
		// newFile.name=name;
		// newFile.type=type;
		// newFile.size=size;
		//var fileArray=JSON.stringify([newFile]);
		//var fileArray=[newFile];
		var fd = new FormData();
		fd.append('pan_card_file', newFile);
		fd.append('full_name', $scope.pc.full_name);
		fd.append('pan_number', $scope.pc.pan_number);
		fd.append('date_of_birth',$scope.pc.date_of_birth);
		fd.append('state',11);
		fd.append('login_session_key',login_session_key);

		// console.log("convert blob file ",newFile);
		//console.log("[newFile] ",[newFile]);

		if ($scope.form.file.$valid && $scope.file) {
			$data.pan_card_file=[newFile]
			//console.log("data ",fd);
			appDB
			.callPostForm('user/verify_pan_card',fd) 
			.then(
				function success(data){ 
					if(data.code == 200 && data.status == 1){ 
						$scope.settings = data.response; 
						//console.log("pan data success ",data);     		
					} 
				},
				function error(data){ 
					//console.log("pan data error ",data);     	     
				}
				);
		}
	}

	/* Verify mobile number*/
	$scope.verifyMobileNo = function(formData){
		$scope.mobileNumber;
	}
	$scope.$on('updateBalanceEvent',function(event){
		$scope.updateBalance();
	});
	$scope.updateBalance = function(){
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
			  $scope.totalBalance = $localStorage.totalBalance;
			  $scope.chipBalance = $localStorage.chipBalance;
			} 
		  },
		  function error(data){
			if (data!=null) {         
			  $scope.walletErrMsg=data.message;
			}
		  }
		);
	}
	$scope.updateBalance();
	var storedCountry="";
	/*Fetch user profile details*/
	//$scope.getUserProfile = function(){ 
		$scope.users = [];
		appDB
		.callPostForm('user/profile_details',$data) 
		.then(
			function success(data){ 
				
				if(data.code == 200 && data.status == 1){ 
					$scope.users = data.response;      
					$scope.users.country = '101';
					$scope.users.date_of_birth = $filter('date')(new Date($scope.users.date_of_birth), "dd-MM-yyyy");
					var country = $scope.users.country;
					$scope.dob = $scope.users.date_of_birth;
				
					$rootScope.$broadcast('getUserDetail',$scope.users);
					
					if($scope.users.user_image=='')
					{
						$scope.users.user_image = $scope.env.image_base_url+"/add_player.png"
					}
					else
					{
						$localStorage.userDetails.user_image = $scope.users.user_image;
					}
					$scope.getCountriesList();
					$scope.changeCountry(country,false);
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
	//}

	/*------------Get countries list-------------------*/
	$scope.getCountriesList = function(){
		$scope.countries = [];
		appDB
		.callPostForm('user/countries',$data) 
		.then(
			function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.countries = data.response;  
					$scope.errorMsg="";
				} 
			},
			function error(data){ 
				//$scope.errorMsg = data.message;      
			}
			);
	}

	/*------------Get State list-------------------*/
	$scope.changeCountry = function(country,resetState){
		if (country!=storedCountry) {
			if (resetState) {
				$scope.users.state="";
			}
		}
		$scope.states = [];
		$data.country_id = country;
		appDB
		.callPostForm('user/states',$data) 
		.then(
			function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.states = data.response;
					$scope.users.state = $scope.users.state;
					$scope.errorMsg="";
				} 
			},
			function error(data){ 
				$scope.errorMsg = data.message; 
			}
			);
	}
	/*Upload Profile Pic*/
	$scope.$watch('picFile', function (files,old) {
		$scope.formUpload = false;
		if (files != null) {
		 var fd = new FormData();
		 fd.append('login_session_key',$localStorage.userDetails.login_session_key);
		 fd.append('user_image', files);
		 appDB
		 .callPostImage('user/change_profile_image',fd) 
		 .then(
			 function success(data){ 
				 if(data.code == 200 && data.status == 1){ 
					 $scope.updatedUserData = data.response;  
					 $scope.users.user_image = data.response.user_image;
									 } 
			 },
			 function error(data){ 
				 $scope.errorMsg = data.message; 
			 }
			 );
		}
	  });
	
	
	  

	/*------------ update user profile -------------------*/  
	$scope.updatedUserData = [];
	
	$scope.updateProfile= function (form) {

		var data={};
		/*Handle Date for Requested Format*/
		var dob = '';
		var dateString = $scope.users.date_of_birth;
		if($scope.users.date_of_birth != '' && $scope.users.date_of_birth != null && $scope.users.date_of_birth !=  undefined && typeof dateString === 'string'){
			var dateParts = dateString.split("-");
			var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
			dob = $filter('date')(dateObject, "yyyy-MM-dd");
		}
		data.name=$scope.users.name;
		data.date_of_birth=dob;
		data.gender=$scope.users.gender;
		data.mobile=$scope.users.mobile;
		data.country=$scope.users.country;
		data.state=$scope.users.state;
		data.city=$scope.users.city;
		data.address=$scope.users.address;
		data.pin_code='452010';
		data.login_session_key= $data.login_session_key;
		$scope.submitted = true;
        $scope.profileMsg = false;
		appDB
		.callPostForm('user/update_profile',data) 
		.then(
			function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.updatedUserData = data.response;  
					$scope.errorMsg="";
				    $scope.profileSuccess="*Profile has been updated sucessfully!";
					$scope.profileMsg = true; 
					setTimeout(function(){  
						$scope.closePopup("edit_profile");
						$scope.profileMsg =false;
						let isFirstProfile = parseInt($localStorage.isFirstProfile);
						if(isFirstProfile === 0)
						{
							$localStorage.isFirstProfile = 1;
							$location.url('/mobileverification');
						}
					}, 2000);
				} 
				else
				{
					$scope.errorMsg = 1;
					$scope.errorMsgDetail =  "*"+data.message;	
				}
			},
			function error(data){ 
				$scope.errorMsg = 1;
				$scope.errorMsgDetail =  "*"+data.message;  
			}
			);
	}
	/*------------ Get user notification -------------------*/ 
    //$scope.userNotification=function () {
      	$scope.notification = [];
      	appDB
      	.callPostForm('user/notification',$data)
      	.then(
            function success(data) {
            	if(data.code == 200 && data.status == 1){ 
					$scope.notification = data.response;
					$scope.status = data.status;
					$scope.errorMsg="";					
				} 
            },
            function error(data) {
            	   $scope.errorMsg = data.message; 
            }
      		);
   // }
	if(path.search('/contest/')>-1)
	{
		$scope.activeSection = 'contest';
	}
	else if(path.search('/line-up/')>-1)
	{
		$scope.activeSection = 'line-up';	
	}
	else
	{
		$scope.activeSection = 'default';	
	}

	$scope.manage_profile_popup = function(){
		$('#edit_profile').modal('show');	
		if(!$localStorage.userDetails.date_of_birth)
		{
			$scope.users.date_of_birth = '';
		}
	}

	$scope.logout = function()
	{
		delete $localStorage.isLoggedIn;
		delete $localStorage.userDetails;
		delete $localStorage.walletBalance;
		delete $localStorage.signupType;
		delete $localStorage.totalBalance;
		delete $localStorage.isFirstLoginSkip;
		delete $localStorage.isFirstProfile;
		localStorage.clear()
		$location.url('/');
		$window.location.reload();
	}
	

	/*Get all list of series starts*/
	/*Button Handler*/
	$scope.hideAdv = 1;
	$scope.ads = [];
	$scope.fetchAd = function(){
		appDB.callPostForm('user/advertisement_banners_list',$data) 
		.then(
		function success(data){ 
				if(data.code == 200 && data.status == 1){ 
					$scope.ads = data.response;
					$timeout(function(){
						$scope.applyBannerSlider();
					}.bind($scope),2000);
					
				} 
		},
		function error(data){ 
		});
	}	
	switch($location.path())
	{
		case '/contest': 
		$scope.hideAdv=0;
		$scope.fetchAd();
		break; 
		default:
		$scope.hideAdv=1;
	}
	$scope.isAffiliate = false;
	if($location.path()=='/affiliate')
	{
		$scope.isAffiliate = true;
	}


}]);
