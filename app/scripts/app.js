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
angular.module('ngCordova.plugins.bluetoothle');
angular.module('ngCordova.plugins.contacts');
angular.module('jewelApp.controllers', [
  'ngCordova.plugins.bluetoothle',
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
  'jewelApp.services',
  'jewelApp.controllers',
  'jewelbots.utils',
  'jewelApp.directives'
  ])
.run(
 ['$ionicPlatform',
  '$logService',
   'DataService',
   'Parse',
  function (
  $ionicPlatform,
  $logService,
  DataService,
  Parse
  ) {
    Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
    $logService.Log('message', 'platform is: ' + JSON.stringify(ionic.Platform.platform()) );
  $ionicPlatform.ready(function() {
    if (navigator.contacts === undefined) {
      $logService.Log('message', 'contacts plugin not loaded');
    }
    if (bluetoothle === undefined) {
      $logService.Log('error', 'bluetoothle has not been loaded; check your cordova plugin installs!');
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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
      });


      $urlRouterProvider.otherwise('/load');
}]);





