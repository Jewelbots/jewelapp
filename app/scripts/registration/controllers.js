'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle){
    //$scope.model = {
    //};
    $scope.services = [];
    $scope.model = {
      status : 'starting...',
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

    $scope.getAvailableDevices = function () {
      var params = {
        request: true
      };
      $ionicPlatform.ready()
        .then(function () {
          return $cordovaBluetoothle.initialize(params)
            .then(function (initialized) {
              $logService.LogMessage('initialized: ' + JSON.stringify(initialized));
              $scope.model.status = 'Bluetooth Initialized!';
              return $cordovaBluetoothle.startScan(params);
            });
        })
        .then(function (data) {
          $scope.model.status = 'Scanning...';
          if (data.status === 'scanResult') {
            $scope.model.status = 'Found device: ' + data.name;
            $logService.LogMessage('pushing new data: 1 ' + JSON.stringify(data));
            $scope.model.devices.push(data);
            return $cordovaBluetoothle.stopScan();
          }
        }, function (error) {
          $scope.model.status = 'Error while scanning.' + JSON.stringify(error);
          return $cordovaBluetoothle.stopScan();
        }, function (notify) {
          $logService.LogMessage('still scanning: ' + JSON.stringify(notify));
        })
        .then(function () {
          $scope.model.status = 'ending scan 1';
          return $cordovaBluetoothle.isScanning().then(function (isScanning) {
            $logService.LogMessage('Are we scanning? 1' + JSON.stringify(isScanning));
            $scope.model.status = 'ended scan 1';
          });
        })
        .then(function () {
          $scope.model.status = 'ending scan 1';
          return $cordovaBluetoothle.isScanning().then(function(isScanning) {
            $logService.LogMessage('Are we scanning? 2' + JSON.stringify(isScanning));
            $scope.model.status = 'ended scan 2';
          });
        });
    };

    $scope.clearLog = function () {
      $logService.Clear();
    };

}])

.controller('RegistrationCtrl', function(){

});
