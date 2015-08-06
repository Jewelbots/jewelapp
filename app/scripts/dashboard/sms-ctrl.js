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

    $scope.checkVerifyCode = function (verificationCode) {
      $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode));
      if ($scope.model.verificationCode === verificationCode) {
        $state.go('dashboard', {src: 'phoneVerification'});
      }
      else if ($scope.model.verificationCode !== verificationCode) {
        $logService.Log('message', 'verificationCode : ' + JSON.stringify(verificationCode) + ' does not equal Model: ' + $scope.model.verificationCode);
      };
    };

    if ($stateParams.hasOwnProperty('telephone') && $stateParams.telephone.length > 0) {
      $scope.model.verificationCode = Math.floor(Math.random()*999999);
      console.log($stateParams.telephone);
      Parse.Cloud.run('sendVerification', { telephone: $stateParams.telephone, verificationCode: verificationCode }).then(function (response) {
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
