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
  '$q',
  function(
  $cordovaBluetoothle,
  ionicReady,
  $logService,
  $scope,
  $state,
  $timeout,
  DataService,
  $q
  ){
    $scope.model = {
      status : 'starting...',
      chosenDevice : {},
      devices : [],
      pairing: false,
      isPaired : false,
      offerRetry : false,
      deviceChosen : function () {
        return Object.keys($scope.model.chosenDevice).length !== 0;
      }
    };

    $scope.pairToDevice = function(address) {

        $scope.model.pairing = true;
        ionicReady()
          .then(function () {
                  $logService.Log('message', 'ionic ready' + address);
            return $cordovaBluetoothle.connect({address: address})
              .then( function (success) {
                $scope.model.pairing = false;
                $scope.model.isPaired = true;
                $logService.Log('message', 'about to pair' + address);
                DataService.Pair(success.address);
                $logService.Log('message', 'successful pair:' + address);
                $scope.NeedsFirmwareUpdate();
              })
              .error(function (err) {
                $scope.model.status = 'Error While Connecting: ' + JSON.stringify(err);
                $logService.Log('Error While Connecting: ' + JSON.stringify(err));
                return $cordovaBluetoothle.disconnect(address); })
              .notify(function (notify) {
                $logService.Log('message', 'still trying to connect: ' + JSON.stringify(notify));
              });
          });
    };

    $scope.getAvailableDevices = function () {
      //TODO: can it filter here instead of in an if statement below?
      var params = {};

      ionicReady().then(function () {
        return $cordovaBluetoothle.initialize(params)
      })
      .then(function (data) {
        $scope.model.debug += "init: " + JSON.stringify(data)
        return $cordovaBluetoothle.startScan(params);
      })
      .then(function (data) {
        $scope.model.status = 'Scanning...';
        //$logService.Log('message', 'scan results: ' + JSON.stringify(data));
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
        if($scope.model.devices.length === 0) {
          $scope.model.offerRetry = true;
          $scope.model.error = "We couldn't find your Jewelbot! Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device."
        }
        return $cordovaBluetoothle.stopScan();
      })
      .catch(function(err) {
        if(err.error === "enable") {
          $scope.model.error = "Please enable bluetooth on your mobile device and try again."
        } else {
          $logService.Log('error', 'Error Getting Available Devices: ' + JSON.stringify(err));
          $scope.model.debug = JSON.stringify(err);
          $scope.model.error = "There was an error trying to find your Jewelbot. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.";
        }
        $scope.model.offerRetry = true;
        return $cordovaBluetoothle.stopScan();
      })
    };

    $scope.init = function () {
      try {
        if (!DataService.IsPaired()) {
          $logService.Log('message', 'thinks we are paired');

          $scope.getAvailableDevices();
        }
        else {
          $logService.Log('message', 'Im paired, but not moving');
          $scope.model.status = "Already Paired: " + $scope.model.chosenDevice;
          return $state.go('friends');
        }
      }
      catch (err) {
        $logService.Log('error', 'error trying to getAvailableDevices: ' + JSON.stringify(err));
        $scope.model.debug = JSON.stringify(err);
        $scope.model.error = "There was an error trying to get a device. Please make sure your Jewelbot is turned on, in pairing mode, and near your mobile device.";
        $scope.model.offerRetry = true;
      }
    };

    $scope.retry = function () {
      $logService.Log('message', 'retry' +   DataService.IsPaired());
      $scope.model.error = "";
      $scope.model.offerRetry = false;
      $scope.getAvailableDevices();
    };
    $scope.NeedsFirmwareUpdate = function () {
    var deviceId = DataService.GetDeviceId();
    var params = {address: deviceId};

    var result = $cordovaBluetoothle.initialize({'request': true})
    .then(function (response) {
      $logService.Log(response);
      return $timeout($cordovaBluetoothle.connect({address: deviceId}))
    })
    .then(function(response) {
      $logService.Log(response);
      return $cordovaBluetoothle.services({address: deviceId})
    })
    .then(function(response) {
      $logService.Log(response);
      return $cordovaBluetoothle.characteristics({address: deviceId, service: "180A"})
    })
    .then(function(response) {
      $logService.Log(response);
      return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "180A", characteristic: "2A26"})
    })
    .then(function(response) {
      var versionBytes = $cordovaBluetoothle.encodedStringToBytes(response.value);
      var version = $cordovaBluetoothle.bytesToString(versionBytes);
      // TODO: when this is workable, check against server version
      // to kick off DFU process as necessary
      // it also makes sense to check against a minimum firmware version
      // before app DFU is implemented to warn them to upgrade
      // but this can't be done until 2a26 broadcasts appropriately
      // so obviously this would need to be updated to not hardcode a ver #
      $logService.Log('actual version:' + version);
      $logService.Log('version:' + DataService.FirmwareUpdateRequired(version));
      //version = 0;
      if(DataService.FirmwareUpdateRequired(version)) {
        $logService.Log('returned true');
        return $state.go('needs-update');

      } else {
        $scope.model.chosenDevice = {};
        $scope.model.isPaired = false;
        $logService.Log('ready for the next page');
        return $state.go('friends-list');
      }
      })
    .catch(function(err) {
      $logService.Log('error', 'failed getFirmware Revision: ' + JSON.stringify(err));
    });
  };
    $scope.init();
}]);
