'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle){
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
    $scope.pairToDevice = function() {
        //var paired = JewelbotService.Pair(device);
        //if ('success') {
        //  $state.transitionTo('pair-success', device.name);
        //}
        //else {
        //  $scope.model.status.push('didn\'t succeed' + paired);
        //}
    };
    $scope.getAvailableDevices = function() {

      $logService.LogMessage('Getting devices');
      var params = {'serviceUuids': []};
      $ionicPlatform.ready(function () {
        params.request = true;
        $logService.LogMessage('Entering initalization');
        $logService.LogMessage('ble initialized:\n' + JSON.stringify(params));
        $cordovaBluetoothle.initialize(params).then(function (result) {
          $logService.LogMessage('result of initialize call: ' + JSON.stringify(result));
          $logService.LogMessage('Stepping into scanning');
          $cordovaBluetoothle.startScan(params).then(function (data) {
            if (data.status === 'scanResult') {
              $logService.LogMessage('found! : ' + JSON.stringify(data));
              $scope.model.devices.push(data);
            } else {
              $logService.LogMessage('still scanning');
            }
          }, function (err) {
            $logService.LogMessage('error while scanning ' + JSON.stringify(err));
          }, function (notify) {
            $logService.LogMessage('notifying: ' + JSON.stringify(notify));
          });

        }, function (alreadyInit) {
          $logService.LogMessage('already initialized: ' + JSON.stringify(alreadyInit));
        }).then(function () {
            $logService.LogMessage('stopping scan');
            $timeout($cordovaBluetoothle.stopScan, 10000);
          });
      });
    };

    $scope.clearLog = function () {
      $logService.Clear();
    };

}])

.controller('RegistrationCtrl', function(){

});
