 'use strict';

 var app = angular.module('fxi',
  ['ui.router',
  'ui.bootstrap',
  'ngStorage',
  'ngSanitize',
  'socialLogin',
  'ngFileUpload',
  'ngMaterial',
  'jkAngularRatingStars',
  'ngScrollSpy'
  ]);

 app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
   .state('testHome', {
    url: '/testHome',
    templateUrl: 'Front-End/app/pages/home/home.html',
    controller : 'homeCtrl'
  })

  .state('/', {
    url: '/',
    templateUrl: 'Front-End/app/pages/home/testHome.html',
    controller : 'homeCtrl'
  })
  .state('login',{
   url:'/login',
   templateUrl: 'Front-End/app/pages/login/login.html',
   controller: 'loginCtrl'
 })
  .state('signup',{
   url:'/signup?referral',
   templateUrl: 'Front-End/app/pages/signup/signup.html',
   controller: 'signupCtrl'
 })
  .state('forget-password',{
    url:'/forget-password',
    templateUrl: 'Front-End/app/pages/forget-password/forget-password.html',
    controller: 'forgetPasswordCtrl'
  })
  .state('contest',{
    url:'/contest',
    templateUrl: 'Front-End/app/pages/contest/home.html',
    controller: 'contestCtrl'
  })
  .state('aadhar-card',{
    url:'/aadhar-card',
    templateUrl: 'Front-End/app/pages/settings/aadhar.html',
    controller: 'settingsCtrl'
  })
  .state('settings',{
    url:'/settings',
    templateUrl: 'Front-End/app/pages/settings/bank-account.html',
    controller: 'settingsCtrl'
  })
  .state('verify-email',{
    url:'/verify-email',
    templateUrl: 'Front-End/app/pages/settings/verify-email.html',
    controller: 'settingsCtrl'
  })
  .state('pancard',{
    url:'/pan-card',
    templateUrl: 'Front-End/app/pages/settings/pan-card.html',
    controller: 'settingsCtrl'
  })
  .state('mobileVerify',{
    url:'/mobileverification',
    templateUrl: 'Front-End/app/pages/settings/mobile-number.html',
    controller: 'settingsCtrl'
  })
  .state('payTmOld',{
    url:'/paytm',
    templateUrl: 'Front-End/app/pages/header-home/paytm.html',
    controller: 'headerCtrl'
  })
  .state('team',{
    url:'/team',
    templateUrl: 'Front-End/app/pages/team/team.html',
    controller: 'teamCtrl'
  }) 
  .state('paytm',{
    url:'/ac-balance?orderid',
    templateUrl: 'Front-End/app/pages/paytm/account_balance.html',
    controller: 'paytmCtrl'
  })
  .state('abouts',{
    url:'/about-us',
    templateUrl: 'Front-End/app/pages/about-us/about_us.html',
    controller: 'aboutCtrl'
  }) 
  .state('contactUs',{
    url:'/contactus',
    templateUrl: 'Front-End/app/pages/contact-us/contact_us.html',
    controller: 'contactCtrl'
  })
  .state('testimonials',{
    url:'/testimonials',
    templateUrl: 'Front-End/app/pages/testimonial/testimonial.html',
    controller: 'testimonialCtrl'
  })
  .state('faqs',{
    url:'/faqs',
    templateUrl: 'Front-End/app/pages/faqs/faq.html',
    controller: 'faqCtrl'
  }) 
  .state('legalities',{
    url:'/legalities',
    templateUrl: 'Front-End/app/pages/legality/legality.html',
    controller: 'legalityCtrl'
  }) 
  .state('sitemap',{
    url:'/sitemap',
    templateUrl: 'Front-End/app/pages/sitemap/sitemap.html',
    controller: 'sitemapCtrl'
  }) 
  .state('howToPlay',{
    url:'/howtoplay',
    templateUrl: 'Front-End/app/pages/howtoplay/how-to_play.html',
    controller: 'howtoplayCtrl'
  }) 
  .state('privacyPolicy',{
    url:'/privacypolicies?q',
    templateUrl: 'Front-End/app/pages/privacypolicy/privacy.html',
    controller: 'privacyCtrl'
  })
  .state('terms-conditions',{
    url:'/terms-conditions',
    templateUrl: 'Front-End/app/pages/terms-conditions/termsconditions.html',
    controller: 'terms_conditionsCtrl'
  })
  .state('player-detail',{
    url:'/player-detail/:id',
    templateUrl: 'Front-End/app/pages/player_detail/player_detail.html',
    controller: 'playerDetailCtrl'
  })
  .state('payment-mode',{
    url:'/payment-mode',
    templateUrl:'Front-End/app/pages/payment-mode/paymentmode.html',
    controller: 'paymentMode'
  })
  .state('wallet',{
    url: '/wallet',
    templateUrl: 'Front-End/app/pages/wallet/wallet.html',
    controller: 'walletCtrl'
  })
  .state('point-system',{
    url:'/point-system',
    templateUrl: 'Front-End/app/pages/point_system/point_system.html',
    controller: 'pointSystemCtrl'
  })
  .state('invite',{
    url:'/invite',
    templateUrl: 'Front-End/app/pages/invite/invite.html',
    controller: 'inviteCtrl'
  })
  .state('faq',{
    url:'/faq',
    templateUrl: 'Front-End/app/pages/faqs/faq.html',
    controller: 'faqCtrl'
  })
  .state('score-card',{
    url:'/score-card/:seriesid/:matchid',
    templateUrl: 'Front-End/app/pages/score-card/score-card.html',
    controller: 'scorecardCtrl'
  })
  .state('career',{
    url:'/career',
    templateUrl: 'Front-End/app/pages/carrier/carrier.html',
    controller: 'carrierCtrl'
  })
  .state('team-score-card',{
    url:'/team-score-card/:seriesid/:matchid/:teamid/:userid/:contestid',
    templateUrl: 'Front-End/app/pages/team-score-card/score-card.html',
    controller: 'teamscorecardCtrl'
  })
  .state('affiliate',{
    url: '/affiliate',
    templateUrl: 'Front-End/app/pages/affiliate/affiliate.html',
    controller: 'affiliateCtrl'
  })
  .state('prediction-landing',{
    url:'/prediction-detail',
    templateUrl: 'Front-End/app/pages/prediction/prediction.html',
    controller: 'predictionCtrl'
  })
  .state('match-prediction',{
    url:'/match-prediction/:id',
    templateUrl: 'Front-End/app/pages/prediction/match-prediction.html',
    controller: 'predictionCtrl'
  })
  .state('my-predictions',{
    url:'/my-predictions',
    templateUrl: 'Front-End/app/pages/prediction/my-predictions.html',
    controller: 'predictionCtrl'
  })
  .state('my-prediction-detail',{
    url:'/my-prediction-detail/:id',
    templateUrl: 'Front-End/app/pages/prediction/my-prediction-detail.html',
    controller: 'predictionCtrl'
  })
  .state('promotion',{
    url:'/promotion',
    templateUrl: 'Front-End/app/pages/promotion/promotion.html',
    controller: 'promotionCtrl'
  })
  .state('deposit',{
    url:'/deposit',
    templateUrl: 'Front-End/app/pages/deposit/deposit.html',
    controller: 'depositCtrl'
  })

  .state('landing',{
    url:'/landing',
    templateUrl: 'Front-End/app/pages/Landing/landing.html',
    controller: 'landingCtrl'
  })
  ;
});
