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
  '$ionicPlatform',
  '$logService',
  '$timeout',
   'DataService',
   'Parse',
  function (
  $cordovaSplashscreen,
  $cordovaPushV5,
  $ionicPlatform,
  $logService,
  $timeout,
  DataService,
  Parse
  ) {
    Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
    $logService.Log('message', 'platform is: ' + JSON.stringify(ionic.Platform.platform()) );
  $ionicPlatform.ready(function() {
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
      $logService.Log('message', 'This is push: ' + JSON.stringify(push));
      return $cordovaPushV5.register();
    }).then(function (registration) {
      $logService.Log('message', 'we were registered: ' + JSON.stringify(registration));
      return $cordovaPushV5.onNotification(function (notification) {
        $logService.Log('message', 'we were notified: ' + JSON.stringify(notification));
      });
    }).then(function(notification) {
      $logService.Log('message', 'received push notification, data is: '+ JSON.stringify(notification));
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
     .state('dashboard', {
          url: '/dashboard/:src',
          controller: 'DashboardCtrl',
          templateUrl: 'templates/dashboard/index.html'
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
      .state('load', {
        url: '/load',
        controller: 'LoadCtrl',
        templateUrl: 'templates/start/load.html'
      })
      .state('start', {
        url: '/start',
        controller: 'StartCtrl'
      })
      .state('birthday', {
        url: '/start/birthday',
        controller: 'BirthdayCtrl',
        templateUrl: 'templates/start/birthday.html'
      })
      .state('privacy',{
        url: '/start/privacy',
        controller: 'PrivacyCtrl',
        templateUrl: 'templates/start/privacy.html'
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
            controller: 'DemoCtrl'
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
      ;
      $urlRouterProvider.otherwise('/start');
}]);





