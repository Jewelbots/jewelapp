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
      $logService.LogMessage('Getting devices');
      var devices = JewelbotService.GetDevices();
      $logService.LogMessage('got devices');
      $scope.model.status.push(devices);
      for (var property in devices) {
        $scope.model.devices.push({name: devices[property]});
      }
    };

}])

.controller('RegistrationCtrl', function(){

});
