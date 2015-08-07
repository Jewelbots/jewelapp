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
    Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
  $scope.model = {

  };
    $scope.startUp = function () {
      if ($stateParams.hasOwnProperty('telephone') && $stateParams.telephone.length > 0) {
        $scope.model.userEnteredTelephone = $stateParams.telephone;
          Parse.Cloud.run('sendVerification', { phoneNumber: $stateParams.telephone, verificationCode: $scope.model.verificationCode }).then(function (response) {
            $logService.Log('message', 'sent SMS; Response: ' + JSON.stringify(response));
            $scope.model.verificationCode = response;
          }, function (error) {
            $logService.Log('error', 'something bad happened! ' + JSON.stringify(error));
          });
        delete $stateParams.telephone;
      }
    };
    $scope.checkVerifyCode = function () {
      $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode));
      if ($scope.model.verificationCode === $scope.model.userInputVerificationCode) {
        UserService.SetPhoneNumber($scope.model.userEnteredTelephone);
        $state.go('dashboard', {src: 'phoneVerification'});
      }
      else if ($scope.model.verificationCode !== verificationCode) {
        //Todo: write alert for user
        $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode) + ' does not equal Model: ' + $scope.model.verificationCode);
      }
    };

    $scope.noSMS = function () {

    };

    $scope.startUp();

  }]);
