'use strict';
angular.module('jewelApp.controllers')
  .controller('StartCtrl',['$scope', '$state', '$ionicPopup', 'JewelbotService',  function ($scope, $state, $ionicPopup, JewelbotService) {
    var model = {

    };
    $scope.checkboxModel = {
      checked : false
    };
    $scope.isPaired = function() {
      return JewelbotService.IsPaired();
    };
    $scope.verifyChecked = function() {
      if ($scope.checkboxModel.checked) {
        $state.go('pair');
      }
      else {
        $ionicPopup.alert({
          template: 'We need to make sure you have read and understood our privacy police. Please read all the way through and tap the checkbox before tapping \'Confirm\'',
          title: 'Please Confirm'
        });
      }
    };

    $scope.model = model;
  }])
  .controller('LoadCtrl', ['$ionicLoading', '$state', '$scope', '$timeout', 'UserService', 'JewelbotService', function($ionicLoading, $state, $scope, $timeout, UserService, JewelbotService) {
    $scope.show = function() {
      $ionicLoading.show({
        templateUrl: '/templates/start/load.html'
      });

    };

    $scope.hide = function() {
      $ionicLoading.hide();
      if (!UserService.HasBirthday()) {
        $state.transitionTo('birthday');
      }
      if (UserService.AgreedToPrivacyPolicy()) {
        if (!JewelbotService.IsPaired()) {
          $state.transitionTo('pair');
        }
        else {
          $state.transitionTo('interstitial');
        }
      } else {
        $state.transitionTo('privacy');
      }
    };
    $timeout($scope.show(), 5000, $scope.hide);

  }]);
