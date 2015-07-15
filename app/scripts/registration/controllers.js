'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle){
    $scope.model = {
      status : 'starting...',
      chosenDevice : {},
      devices : [],
      pairing: false,
      isPaired : false,
      deviceChosen : function () {
        return Object.keys(chosenDevice).length !== 0;
      }
    };

    $scope.pairToDevice = function(address) {
        $scope.model.pairing = true;
        $logService.LogMessage('chosen device was: ' + JSON.stringify(address));
        $ionicPlatform.ready()
          .then(function () {
            return $cordovaBluetoothle.connect({address: address})
              .then( function (success) {
                $scope.model.status = 'Successfully connected!';
                $scope.model.pairing = false;
                $scope.model.isPaired = true;
                $logService.LogMessage('successfully connected to: ' + JSON.stringify(success));
              })
              .error(function (err) {
                $scope.model.status = 'Error While Connecting: ' + JSON.stringify(err);
                return $cordovaBluetoothle.disconnect(address);
              });
          })
          .then( function (success) {
            return $timeout($state.transitionTo('/pair-success'), 2000);
          });

    };

    var getAvailableDevices = function () {
      var params = {
        request: true,
        name: 'JewelBot'
      };
      $ionicPlatform.ready()
        .then(function () {
          return $cordovaBluetoothle.initialize(params)
            .then(function (initialized) {
              $logService.LogMessage('initialized: ' + JSON.stringify(initialized));
              $scope.model.status = 'Bluetooth Initialized!';
              return $cordovaBluetoothle.find(params);
            });
        })
        .then(function (data) {
          $scope.model.status = 'Scanning...';
          if (data.status === 'scanResult') {
            $scope.model.status = 'Found device: ' + data.name;
            $logService.LogMessage('pushing new data: ' + JSON.stringify(data));
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
          $scope.model.status = 'ending scan...';
          return $cordovaBluetoothle.isScanning().then(function(isScanning) {
            $logService.LogMessage('Are we scanning? 2' + JSON.stringify(isScanning));
            $scope.model.status = isScanning ? 'Scan Ended' : 'Scan Not Ended';
          });
        });
    };
    getAvailableDevices();
}])

.controller('RegistrationCtrl', function(){

});
