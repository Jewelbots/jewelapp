'use strict';
angular.module('jewelApp.controllers')
  .controller('StartCtrl', [
  '$scope',
  '$state',
  'JewelbotService',
  'UserService',
  function (
  $scope,
  $state,
  JewelbotService,
  UserService
  ) {

    if (!JewelbotService.IsPaired()) {
      console.log('user has not paired device');
      $state.transitionTo('pair');
    }
    else {
      console.log('paired-> to dashboard!');
      $state.transitionTo('dashboard');
    }

  }])
  .controller('LoadCtrl', [
  '$ionicLoading',
  '$scope',
  '$state',
  '$timeout',
  function(
  $ionicLoading,
  $scope,
  $state,
  $timeout
  ) {
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
  .controller('PrivacyCtrl', [
  '$ionicPopup',
  '$scope',
  '$state',
  'UserService',
  function(
  $ionicPopup,
  $scope,
  $state,
  UserService
  ) {
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
          template: 'We need to make sure you have read and understood our privacy policy. Please read all the way through and tap the checkbox before tapping \'Confirm\'',
          title: 'Please Confirm'
        });
      }
    };
    console.log('entered privacy controller');

  }]);
