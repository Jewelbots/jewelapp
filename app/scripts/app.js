'use strict';
angular.module('jewlieApp', ['ionic', 'jewlieApp.services', 'jewlieApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
  controller: 'DashboardCtrl',
  templateUrl: 'templates/home.html'
})
  .state('pair', {
    url: '/pair',
    controller: 'PairCtrl',
    templateUrl: 'templates/pair_to_device.html'
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
  .state('login', {
    url: '/login',

        controller: 'LoginCtrl',
        templateUrl: 'templates/login.html'

  })
  .state('signup', {
    url: '/sign-up',

        controller: 'SignupCtrl',
        templateUrl: 'templates/signup.html'

  });
  $urlRouterProvider.otherwise('/home');
});
angular.module('jewlieApp.controllers', []);
angular.module('jewlieApp.services', []);


