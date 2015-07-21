'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle','DataService', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle, DataService){
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
        $logService.Log('message', 'chosen device was: ' + JSON.stringify(address));
        $ionicPlatform.ready()
          .then(function () {
            $logService.Log('message', 'inside pairToDevice: ');
            return $cordovaBluetoothle.connect({address: address})
              .then( function (success) {
                $scope.model.status = 'Successfully connected!';
                $scope.model.pairing = false;
                $scope.model.isPaired = true;
                DataService.SaveConnection(address);
                $logService.Log('message', 'successfully connected to: ' + JSON.stringify(success));
                $logService.Log('message', 'paired! Now transitioning: ' + JSON.stringify(success));
                $state.go('pair-success');
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
      $logService.Log('message', 'entering getAvailable Devices. Next stop, ionic ready');
      var params = {
        request: true,
        name: 'JewelBot'
      };
      $ionicPlatform.ready()
        .then(function () {
          $logService.Log('message', 'ionic ready is successful, next stop initialize');
          return $cordovaBluetoothle.initialize(params)
            .then(function (initialized) {
              $logService.Log('message', 'initialized: ' + JSON.stringify(initialized));
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
            $logService.Log('message', 'pushing new data: ' + JSON.stringify(data));
            $scope.model.devices.push(data);
            return $cordovaBluetoothle.stopScan();
          }
        }, function (error) {
          $scope.model.status = 'Error while scanning.' + JSON.stringify(error);
          return $cordovaBluetoothle.stopScan();
        }, function (notify) {
          $logService.Log('message', 'still scanning: ' + JSON.stringify(notify));
        })
        .then(function () {
          $scope.model.status = 'ending scan...';
          return $cordovaBluetoothle.isScanning().then(function(isScanning) {
            $logService.Log('message', 'chosen device looks like this ' + JSON.stringify($scope.model.chosenDevice));
            $logService.Log('message', 'isScanning returns? ' + JSON.stringify(isScanning));

            $scope.model.status = isScanning ? 'Scan Not Ended' : 'Scan Ended';
            if (isScanning) {
              return $cordovaBluetoothle.stopScan();
            }
          });
        });
    };
    $logService.Log('message', 'about to call getAvailableDevices, which should kick off initialize and scanning');
    getAvailableDevices();
}])

.controller('RegistrationCtrl', function(){

});
