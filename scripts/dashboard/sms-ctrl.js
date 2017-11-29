'use strict';
angular.module('jewelApp.controllers')
.controller('SMSCtrl', [
  '$logService',
  '$scope',
  '$state',
  '$stateParams',
  'Parse',
  'UserService',
  function (
    $logService,
    $scope,
    $state,
    $stateParams,
    Parse,
    UserService
  ) {
  $scope.model = {
    userInputVerificationCode : ''
  };
    $scope.startUp = function () {
      if ($stateParams.hasOwnProperty('telephone') && $stateParams.telephone.length > 0) {
        $scope.model.userEnteredTelephone = $stateParams.telephone;
          Parse.Cloud.run('sendVerification', { phoneNumber: $stateParams.telephone, verificationCode: $scope.model.verificationCode }).then(function (response) {
            $scope.model.verificationCode = response;
          }, function (error) {
            $logService.Log('error', 'something bad happened! ' + JSON.stringify(error));
          });
        delete $stateParams.telephone;
      }
    };
    $scope.checkVerifyCode = function () {
      if ($scope.model.verificationCode.toString() === $scope.model.userInputVerificationCode.toString()) {
        UserService.SetPhoneNumber($scope.model.userEnteredTelephone);
        $state.go('dashboard', {src: 'phoneVerification'});
      }
    };

    $scope.noSMS = function () {

    };

    $scope.startUp();

  }]);
