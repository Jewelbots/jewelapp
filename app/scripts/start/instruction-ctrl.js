'use strict';
angular.module('jewelApp.controllers')
.controller('InstructionCtrl', [
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

      console.log('entered privacy controller');

  }]);
