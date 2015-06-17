'use strict';

angular.module('ngCordova', ['ngCordova.plugins']);
angular.module('ngCordova.plugins.bluetoothle');
angular.module('jewelApp', ['ionic', 'jewelApp.services', 'jewelApp.controllers', 'ngCordova', 'jewelbots.utils'])

.run(['$ionicPlatform', '$cordovaBluetoothle', '$logService', '$window',function($ionicPlatform, $cordovaBluetoothle, $logService, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if($window.cordova.plugins.Keyboard) {
      $logService.LogMessage('Window.cordova.plugins.Keyboard is true');
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($cordovaBluetoothle !== undefined) {
      $logService.LogMessage('$cordovaBluetoothle is present');
    }
    if ($window.cordova.plugins.bluetoothle !== undefined || cordova.plugins.bluetoothle !== undefined) {
      $logService.LogMessage('bluetoothle is present');
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
 .state('dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      templateUrl: 'templates/dashboard/index.html'
 })
.state('home', {
  url: '/home',
  controller: 'HomeCtrl',
  templateUrl: 'templates/home.html'
})
  .state('pair', {
    url: '/pair',
    controller: 'PairCtrl',
    templateUrl: 'templates/pair.html'
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
  .state('addFriends', {
    url:'/add-friends',
    controller: 'FriendsCtrl',
    templateUrl: 'templates/friends/add-friends.html'
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
  });

  $urlRouterProvider.otherwise('/home');
}]);
angular.module('jewelApp.controllers', []);
angular.module('jewelApp.services', ['ngCordova.plugins.bluetoothle', 'jewelbots.utils']);



