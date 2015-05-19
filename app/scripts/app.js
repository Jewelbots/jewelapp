'use strict';
angular.module('jewelApp', ['ionic', 'jewelApp.services', 'jewelApp.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($cordovaBluetoothle) {
      console.log('Bluetooth is on?');
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

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
    url:'add-friends',
    controller: 'FriendsCtrl',
    templateUrl: 'templates/friends/add-friends.html'
  })
  .state('diagnostics', {
    url: 'diagnostics',
    controller: 'DiagnosticsCtrl',
    templateUrl: 'templates/diagnostics/index.html'
  });
  $urlRouterProvider.otherwise('/home');
});
angular.module('jewelApp.controllers', []);
angular.module('jewelApp.services', []);



