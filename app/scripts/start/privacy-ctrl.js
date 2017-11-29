'use strict';
angular.module('jewelApp.controllers')
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
