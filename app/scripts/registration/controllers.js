'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', 'JewelbotService','$logService', function($scope, $state, $timeout, JewelbotService, $logService){
    //$scope.model = {
    //};
    $scope.model = {
      status : [],
      devices : [],
      errors : [],
      messages : []
    };
    $scope.getErrors = function() {
      $timeout(function() {
        $scope.model.errors = $logService.GetErrors();
      });
    };
    $scope.getMessages = function () {
      $timeout(function() {
        $scope.model.messages = $logService.GetMessages();
      });
    };
    $scope.pairToDevice = function(device) {
        var paired = JewelbotService.Pair(device);
        if (paired.result === 'success') {
          $state.transitionTo('pair-success', device.name);
        }
        else {
          $scope.model.status.push('didn\'t succeed' + paired);
        }
    };
    $scope.getAvailableDevices = function() {
      try {
        $logService.LogMessage('Getting devices');
        var params = {serviceUuids: []};
        var response = JewelbotService.GetDevices(params);
        response.then(function (results) {
          $logService.LogMessage('got devices' + JSON.stringify(results));
        });
      }
      catch (e) {
        $logService.LogError('error was: ' + JSON.stringify(e));
      }
    };
    $scope.clearLog = function () {
      $logService.Clear();
    };

}])

.controller('RegistrationCtrl', function(){

});
