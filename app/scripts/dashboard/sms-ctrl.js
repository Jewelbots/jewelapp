'use strict';
angular.module('jewelApp.controllers')
.controller('SMSCtrl', [
  '$logService',
  '$scope',
  '$state',
  '$stateParams',
  'Parse',
  function (
    $logService,
    $scope,
    $state,
    $stateParams,
    Parse
  ) {
    Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
  $scope.model = {

  };
    $scope.checkVerifyCode = function () {
      $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode));
      if ($scope.model.verificationCode === $scope.model.userInputVerificationCode) {
        $state.go('dashboard', {src: 'phoneVerification'});
      }
      else if ($scope.model.verificationCode !== verificationCode) {
        $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode) + ' does not equal Model: ' + $scope.model.verificationCode);
      }
    };

    if ($stateParams.hasOwnProperty('telephone') && $stateParams.telephone.length > 0) {
      $scope.model.verificationCode = Math.floor(Math.random()*999999);
      console.log($stateParams.telephone);
      Parse.Cloud.run('sendVerification', { phoneNumber: $stateParams.telephone, verificationCode: $scope.model.verificationCode }).then(function (response) {
        $logService.Log('message', 'sent SMS; Response: ' + JSON.stringify(response));
        console.log(response);
        delete $stateParams.telephone;
      }, function (error) {
        $logService.Log('error', 'something bad happened! ' + JSON.stringify(error));
      });


    }

    $scope.noSMS = function () {

    };

  }]);
