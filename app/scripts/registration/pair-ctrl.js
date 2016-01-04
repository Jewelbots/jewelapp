'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',[
  '$cordovaBluetoothle',
  'ionicReady',
  '$logService',
  '$scope',
  '$state',
  '$timeout',
  'DataService',
  function(
  $cordovaBluetoothle,
  ionicReady,
  $logService,
  $scope,
  $state,
  $timeout,
  DataService
  ){
    $scope.model = {
      status : 'starting...',
      chosenDevice : {},
      devices : [],
      pairing: false,
      isPaired : false,
      deviceChosen : function () {
        return Object.keys($scope.model.chosenDevice).length !== 0;
      }
    };

    $scope.pairToDevice = function(address) {

        $scope.model.pairing = true;
        ionicReady()
          .then(function () {
            return $cordovaBluetoothle.connect({address: address})
              .then( function (success) {
                $scope.model.pairing = false;
                $scope.model.isPaired = true;
                DataService.Pair(success.address);
                return $state.go('pair-success');
              })
              .error(function (err) {
                $scope.model.status = 'Error While Connecting: ' + JSON.stringify(err);
                return $cordovaBluetoothle.disconnect(address);
              })
              .notify(function (notify) {
                $logService.Log('message', 'still trying to connect: ' + JSON.stringify(notify));
              });
          });
    };

    var getAvailableDevices = function () {
      var params = {
        request: true,
        name: 'JewelBot'
      };
      ionicReady()
        .then(function () {
          return $cordovaBluetoothle.initialize(params)
            .then(function () {
              $scope.model.status = 'Bluetooth Initialized!';
              return $cordovaBluetoothle.find(params);
            }, function (err) {
              $logService.Log('error', 'Error trying to initialize bluetoothle ' + JSON.stringify(err));
            });
        })
        .then(function (data) {
          $scope.model.status = 'Scanning...';
          if (data.status === 'scanResult') {
            $scope.model.status = 'Found device: ' + data.name;
            $scope.model.devices.push(data);
            return $cordovaBluetoothle.stopScan();
          }
        }, function (error) {
          $scope.model.status = 'Error while scanning.' + JSON.stringify(error);
          return $cordovaBluetoothle.stopScan();
        }, function (notify) {
          $logService.Log('message', 'notifying scan: ' + JSON.stringify(notify));
        })
        .then(function () {
          $scope.model.status = 'ending scan...';
          return $cordovaBluetoothle.isScanning().then(function(isScanning) {
            $scope.model.status = isScanning ? 'Scan Not Ended' : 'Scan Ended';
            if (isScanning) {
              return $cordovaBluetoothle.stopScan();
            }
          });
        });
    };

    try {
      if (!DataService.IsPaired()) {
        getAvailableDevices();
        $cordovaBluetoothle.isScanning().then(function(isScanning) {
          if (isScanning) {
            return $cordovaBluetoothle.stopScan();
          }
        });
      }
    }
    catch (err) {
      $logService.Log('error', 'error trying to getAvailableDevices: ' + JSON.stringify(err));
    }
}]);

