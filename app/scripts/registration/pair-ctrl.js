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
                return $cordovaBluetoothle.disconnect(address); })
              .notify(function (notify) {
                $logService.Log('message', 'still trying to connect: ' + JSON.stringify(notify));
              });
          });
    };

    $scope.getAvailableDevices = function () {
      //TODO: can I filter here instead of in an if statement below?
      var params = {};

      ionicReady().then(function () {
        return $cordovaBluetoothle.initialize(params)
      })
      .then(function () {
        $scope.model.status = 'Bluetooth Initialized!';
        return $cordovaBluetoothle.startScan(params);
      })
      .then(function (data) {
        $scope.model.status = 'Scanning...';
        $logService.Log('message', 'scan results: ' + JSON.stringify(data));
        for(var i=0;i < data.length; i++) {
          $scope.model.debug += JSON.stringify(data[i]);
          if (data[i].status === 'scanResult' && data[i].advertisement.isConnectable && data[i].advertisement.localName === "JWB_") {
            var mfg = "";
            if(data[i].advertisement.manufacturerData !== null) {
              try {
                mfg = $cordovaBluetoothle.encodedStringToBytes(data[i].advertisement.manufacturerData);
              }
              catch (err) {
                $logService.Log('error', 'Error attempting to decode manufacturerData: ' + JSON.stringify(err));
                $scope.model.debug += " --- " + JSON.stringify(err) + "---";
              }
              $scope.model.status += '---Found device: ' + data[i].name + " : " + mfg ;
              $scope.model.devices.push(data[i]);
            }
          }
        }
        return $cordovaBluetoothle.stopScan();
      })
      .catch(function(err) {
        $logService.Log('error', 'Error Getting Available Devices: ' + JSON.stringify(err));
        $scope.model.debug = JSON.stringify(err);
        $scope.model.error = "There was an error trying to find your Jewelbot. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.";
        return $cordovaBluetoothle.stopScan();
      });
    };

    $scope.init = function () {
      try {
        if (!DataService.IsPaired()) {
          $scope.getAvailableDevices();
        }
        else {
          $scope.model.status = "Already Paired: " + $scope.model.chosenDevice;
        }
      }
      catch (err) {
        $logService.Log('error', 'error trying to getAvailableDevices: ' + JSON.stringify(err));
        $scope.model.debug = JSON.stringify(err);
        $scope.model.error = "There was an error trying to get a device. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.";
      }
    };

    $scope.retry = function () {
      $scope.model.error = "";
      $scope.getAvailableDevices();
    };
    $scope.init();
}]);
