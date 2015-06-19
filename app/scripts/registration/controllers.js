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
        var params = {'serviceUuids': []};
        try {
          JewelbotService.GetDevices(params).then(function (data) {
            $scope.model.devices.push(data);
            $logService.LogMessage('data from scan: ' + JSON.stringify(data));
          }, function (error) {
            $logService.LogMessage('got error in stack: ' + JSON.stringify(error));
          },
          function (notify) {
            $logService.LogMessage('getting notified' + JSON.stringify(notify));
          });
        }
        catch(err) {
          $logService.LogMessage('error when trying to get devices: ' + JSON.stringify(err));
        }
        //var promise = JewelbotService.GetDevices(params).when(function (results) {
        //  $logService.LogMessage('got devices' + JSON.stringify(results));
        //  return promise.then (function (result) {
        //    $scope.model.devices.push(result);
        //  });
        //}).catch(function(error) {
        //  $logService.LogMessage('logging error from get devices: ' + JSON.stringify(error));
        //});
      //.then(function (response) {
      //      $logService.LogMessage('scan:\n' + JSON.stringify(response));
      //      if (response.status === 'scanResult') {
      //        $logService.LogMessage('result of scan:\n' + JSON.stringify(response));
      //        var d = response;
      //        $cordovaBluetoothle.stopScan().then(function(stopped){
      //          $logService.LogMessage('stopping scan: ' + JSON.stringify(stopped));
      //          return d;
      //        });
      //      }
      //      else {
      //        $logService.LogMessage('still scanning:\n' + JSON.stringify(response));
      //      }
      //    },
      //    function (error) {
      //      $logService.LogError(error, 'Failed to Start Scan');
      //      return error;
      //    });
    };
    $scope.clearLog = function () {
      $logService.Clear();
    };

}])

.controller('RegistrationCtrl', function(){

});
