'use strict';
angular.module('jewelApp.controllers')
.controller('SMSCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  function (
    $scope,
    $state,
    $stateParams
  ) {

    $scope.checkVerifyCode = function () {
      if ($scope.model.verificationCode === $stateParams.verificationCode) {
        $state.go('dashboard', {src: 'phoneVerification'});
      }
    };

    if ($stateParams.hasOwnProperty('telephone') && $stateParams.telephone.length > 0) {
      console.log($stateParams.telephone);
      $scope.sendSMS($stateParams.telephone);
      //Twilio send SMS;
    }

    $scope.noSMS = function () {

    };

  }]);
