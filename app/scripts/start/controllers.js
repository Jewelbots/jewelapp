'use strict';
angular.module('jewelApp.controllers')
  .controller('StartCtrl',['$scope', '$state', 'UserService', 'JewelbotService',  function ($scope, $state, UserService, JewelbotService) {

    if (!UserService.HasBirthday()) {
      console.log('user does not have birthday set');
      $state.transitionTo('birthday');
      $scope.$apply();
    }
    else if (!UserService.AgreedToPrivacyPolicy()) {
      console.log('user does not have privacy policy agreed to');
      $state.transitionTo('privacy');
      $scope.$apply();

    }
    else if (!JewelbotService.IsPaired()) {
      console.log('user has not paired device');
      $state.transitionTo('pair');
      $scope.$apply();

    }
    else {
      console.log('user did all those things');
      $state.transitionTo('dashboard');
      $scope.$apply();

    }

  }])
  .controller('LoadCtrl', ['$ionicLoading', '$state', '$scope', '$timeout', function($ionicLoading, $state, $scope, $timeout) {
    $scope.show = function() {
      $ionicLoading.show({
        templateUrl: '/templates/start/load.html'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
      $state.transitionTo('start');
    };
    $timeout($scope.show, 5000).then(function() {
      $scope.hide();
    });

  }])
  .controller('BirthdayCtrl',['$scope', '$state', 'UserService',  function ($scope, $state, UserService) {
    console.log('entered birthday controller');
    var birthdayAdded = function() {
      UserService.SetBirthday($scope.model.birthday);
      //if (false === true) { //userisunder13-stub
      //  $state.go('parental-consent');
      //}
      $state.go('privacy');
    };

    $scope.setBirthday = function() {
      UserService.SetBirthday($scope.model.birthday);
      birthdayAdded();
    };
    var model = {
      birthday: ''
    };
    $scope.model = model;


  }])
  .controller('PrivacyCtrl', ['$scope', '$state', '$ionicPopup', 'UserService', function($scope, $state, $ionicPopup, UserService) {
    $scope.checkboxModel = {
      checked : false
    };
    $scope.verifyChecked = function() {
      if ($scope.checkboxModel.checked) {
        UserService.SetPrivacyPolicy(true);
        $state.go('dashboard');
      }
      else {
        $ionicPopup.alert({
          template: 'We need to make sure you have read and understood our privacy police. Please read all the way through and tap the checkbox before tapping \'Confirm\'',
          title: 'Please Confirm'
        });
      }
    };
    console.log('entered privacy controller');

  }]);
