/* global bluetoothle, ionic */
'use strict';
angular.module('lodash', [])
  .factory('_', function() {
    return window._;
  });
angular.module('Parse', [])
  .factory('Parse', function () {
    return window.Parse;
  });
angular.module('CryptoJS', [])
  .factory('CryptoJS', function () {
    return window.CryptoJS;
  });

angular.module('ngCordova', ['ngCordova.plugins']);
angular.module('ngCordovaBluetoothle');
angular.module('ngCordova.plugins.inAppBrowser');
angular.module('ngCordova.plugins.contacts');
angular.module('ngCordova.plugins.push_v5');
angular.module('jewelApp.controllers', [
  'ngCordovaBluetoothle',
  'ngCordova.plugins.contacts'
  ]);
angular.module('jewelApp.services', ['jewelbots.utils', 'CryptoJS', 'Parse', 'ionic']);
angular.module('jewelApp.directives', []);
angular.module('jewelApp',
 [
  'ionic',
  'lodash',
  'Parse',
   'ngCordova',
   'ngCordova.plugins.push_v5',
  'jewelApp.services',
  'jewelApp.controllers',
  'jewelbots.utils',
  'jewelApp.directives'
  ])
.run(
 ['$cordovaSplashscreen',
  '$cordovaPushV5',
   'ionicReady',
  '$logService',
  '$timeout',
   'DataService',
   'Parse',
   'ionicReady',
  function (
  $cordovaSplashscreen,
  $cordovaPushV5,
  ionicReady,
  $logService,
  $timeout,
  DataService,
  Parse
  ) {
    Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
    $logService.Log('message', 'platform is: ' + JSON.stringify(ionic.Platform.platform()) );

    ionicReady().then(function() {
      if (!bluetoothle) {
        $logService.Log('message', 'No bluetoothle');
      }
      else {
        $logService.Log('message','bluetoothle is: ' + JSON.stringify(bluetoothle));
      }
    $cordovaPushV5.initialize({
     'ios': {
        'badge' : true,
        'sound' : true,
        'alert' : true,
        'parseKeys' : {
          'applicationKey' : 'j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU',
          'iosSdkKey' : '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6'
        }
      }
    }).then(function(push) {
      //$logService.Log('message', 'This is push: ' + JSON.stringify(push));
      return $cordovaPushV5.register();
    }).then(function (registration) {
      //$logService.Log('message', 'we were registered: ' + JSON.stringify(registration));
      return $cordovaPushV5.onNotification(function (notification) {
        //$logService.Log('message', 'we were notified: ' + JSON.stringify(notification));
      });
    }).then(function(notification) {
      //$logService.Log('message', 'received push notification, data is: '+ JSON.stringify(notification));
    });

    if (navigator.contacts === undefined) {
      //$logService.Log('message', 'contacts plugin not loaded');
    }
    if (bluetoothle === undefined) {
      $logService.Log('error', 'bluetoothle has not been loaded; check your cordova plugin installs!');
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $timeout(function() {
        $cordovaSplashscreen.hide();
    }, 5000);
  });
}])

.config (
[ '$stateProvider',
  '$urlRouterProvider',
   function (
   $stateProvider,
   $urlRouterProvider) {
     $stateProvider

    //-- SECTION 1
    //-- 1__templates/start/load.html --> App Slpash Screen
    //-- 1__templates/start/load.html --> App Slpash Screen
    .state('privacy', {
      url: '/privacy',
      controller: 'PrivacyCtrl',
      templateUrl: 'templates/start/privacy.html'
    })
    .state('friendship_instruction', {
      url: '/friendship_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/friendship_instruction.html'
    })
    .state('coding_instruction', {
      url: '/coding_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/coding_instruction.html'
    })
    .state('setup_instruction', {
      url: '/setup_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/setup_instruction.html'
    })
    .state('arduino_instruction', {
      url: '/arduino_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/arduino_instruction.html'
    })
    .state('friend_API_instruction', {
      url: '/friend_API_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/friend_API_instruction.html'
    })
    .state('solo_API_instruction', {
      url: '/solo_API_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/solo_API_instruction.html'
    })
    .state('friend_coding_instruction', {
      url: '/friend_coding_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/friend_coding_instruction.html'
    })
    .state('solo_coding_instruction', {
      url: '/solo_coding_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/solo_coding_instruction.html'
    })
    .state('glossery_instruction', {
      url: '/glossery_instruction',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/instruction/glossery_instruction.html'
    })

    //-- 1__templates/start/load.html --> App Slpash Screen

    //-- SECTION 2
    //-- 2__templates/quickstart/news_1.html /news_2.html /news_3.html --> Showed on first load / ...after App update
    .state('quickstart_news_1', {
      url: '/quickstart/news_1',
      //controller: 'NewsCtrl',
      templateUrl: 'templates/quickstart/news_1.html'
    })
    .state('quickstart_news_2', {
      url: '/quickstart/news_2',
      //controller: 'NewsCtrl',
      templateUrl: 'templates/quickstart/news_2.html'
    })
    .state('quickstart_news_3', {
      url: '/quickstart/news_3',
      //controller: 'NewsCtrl',
      templateUrl: 'templates/quickstart/news_3.html'
    })
    .state('dashboard', {
      url: '/dashboard/:src',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/index.html'
    })

    //-- SECTION 3

    //-- SECTION 4
    .state('modal_testing', {
      url: '/modal_testing/',
      templateUrl: 'templates/modal/template.html'
    })
    //-- 4__templates/dashboard/dashboard_nofriends.html --> user has no friend
    .state('dashboard_nofriends', {
      url: '/dashboard_nofriends/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_nofriends.html'
    })
    //-- 4__templates/dashboard/dashboard_nofriends_addphone.html --> user has no friend an is promted to add a phone number / if unsuccesful promt for "Access to Contacts"
    .state('dashboard_nofriends_addphone', {
      url: '/dashboard_nofriends_addphone/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_nofriends_addphone.html'
    })
    .state('dashboard_addphone_error', {
      url: '/dashboard_addphone_error/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_addphone_error.html'
    })
    .state('dashboard_confirm_SMS', {
      url: '/dashboard_confirm_SMS/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_confirm_SMS.html'
    })
    .state('dashboard_send_SMS', {
      url: '/dashboard_send_SMS/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_send_SMS.html'
    })
    .state('dashboard_hasfriends', {
      url: '/dashboard_hasfriends/',
      //controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/dashboard_hasfriends.html'
    })
    .state('friends-list', {
      url: '/friends-list',
      controller: 'FriendsCtrl',
      templateUrl: 'templates/friends/friends-list.html'
    })
    //-- 5__templates/friends/friend_editmodal.html --> clicked on friend on dashboard, opens this modal to 1) change color, delete as friend
    .state('friend_editmodal', {
      url: '/friend_editmodal',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/friends/friend_editmodal.html'
    })
    //-- 6__templates/friend_requests/friend_requests.html --> preferred
    .state('friend_requests', {
      url: '/friend_requests',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/friend_requests/friend_requests.html'
    })
    .state('friend_requests_alt', {
      url: '/friend_requests_alt',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/friend_requests/friend_requests_alt.html'
    })
    //-- 7__templates/contact_list/contact_list.html --> add states to listed friends to activate etc.. need sleep
    .state('contact_list', {
      url: '/contact_list',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/contact_list/contact_list.html'
    })
    //-- 9__templates/error_messages/error_nocolorselected.html -->
    .state('error_nocolorselected', {
      url: '/error_nocolorselected',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/error_messages/error_nocolorselected.html'
    })

    .state('debug-start', {
      url: '/debug-start',
      controller: 'DiagnosticCtrl',
      templateUrl: 'templates/debug-start.html'
    })
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'templates/home.html'
    })
    .state('settings', {
      url: '/settings',
      controller: 'SettingsCtrl',
      templateUrl: 'templates/settings/settings.html'
    })
    .state('pair', {
      url: '/pair',
      controller: 'PairCtrl',
      templateUrl: 'templates/settings/pair.html'
    })
    .state('pair-success', {
      url: '/pair-success',
      controller: 'PairCtrl',
      templateUrl: 'templates/registration/pair-success.html'
    })
    .state('registration-step-two', {
      url: '/register/step-two',
      controller: 'RegistrationCtrl',
      templateUrl: 'templates/registration/registration-step-two.html'
    })
    .state('registration-step-three', {
      url: '/register/step-three',
      controller: 'RegistrationCtrl',
      templateUrl: 'templates/registration/registration-step-three.html'
    })
    .state('registration-step-four', {
          url: '/register/step-four',
          controller: 'RegistrationCtrl',
          templateUrl: 'templates/registration/registration-step-four.html'
    })
    .state('diagnostics', {
      url: '/diagnostics',
      controller: 'DiagnosticCtrl',
      templateUrl: 'templates/diagnostics/index.html'
    })


    .state('start', {
      url: '/start',
      controller: 'StartCtrl'
    })
    .state('sms-verification-screen', {
      url: '/sms/verify/:telephone',
      controller : 'SMSCtrl',
      templateUrl: 'templates/sms/verify.html'
    })
    .state('demo', {
      url: '/demo',
      abstract: true,
      templateUrl: 'templates/demo/tabs.html'
    })
    .state('demo.select', {
      url: '/select',
      views: {
        'demo-select': {
          templateUrl: 'templates/demo/select.html',
          controller: 'DemoCtrl'
        }
      }
    })
    .state('demo.control', {
      url: '/control',
      views: {
        'demo-control': {
          templateUrl: 'templates/demo/control.html',
          controller: 'ControlCtrl'
        }
      }
    })
    .state('demo.weather', {
      url: '/weather',
      views: {
        'demo-weather': {
          templateUrl: 'templates/demo/weather.html',
          controller: 'DemoCtrl'
        }
      }
    })
    .state('needs-update', {
      url: '/needs-update',
      templateUrl: 'templates/friends/needs-update.html'
    })
    .state('startup', {
      url: '/startup',
      controller: 'BrowserCtrl',
      templateUrl: 'templates/startup.html'
    })

    // when debugging
    // $urlRouterProvider.otherwise('/debug-start');
    // when deploying
    $urlRouterProvider.otherwise('/startup');
}]);
