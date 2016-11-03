'use strict';
angular.module('jewelApp.controllers')
  .controller('FriendsCtrl', [
    '$logService',
    '$scope',
    '$state',
    '$timeout',
    '$cordovaBluetoothle',
    'DataService',
    'UserService',
    'JewelbotService',
    '_',
    function(
      $logService,
      $scope,
      $state,
      $timeout,
      $cordovaBluetoothle,
      DataService,
      UserService,
      DeviceService,
      JewelbotService,
      _
    ){
      $scope.model = {
        message: 'Friends!',
        localFriends: UserService.GetFriends(),
        deviceFriends: []
      };
      $scope.startup = function(){
        $scope.model.deviceFriends = $scope.ReadFriends();
      };
      $scope.ReadFriends = function() {
        var result = $cordovaBluetoothle.initialize({'request': true})
        .then(function (response) {
          return $timeout($cordovaBluetoothle.connect({address: DataService.GetDeviceId()}))
        })
        .then(function() {
          $scope.model.message += "\n Inside Connect";
          //TODO: Filter.
          return $cordovaBluetoothle.services({address: DataService.GetDeviceId()})
        })
        .then(function(response) {
          $scope.model.message += "\n Inside Services: " + JSON.stringify(response);
          //TODO: filter.
          return $cordovaBluetoothle.characteristics({address: DataService.GetDeviceId(), service: "63400001-1A1E-5704-0A53-844BD14254A1"})
        })
        .then(function(charReadResponse) {
          $scope.model.message += "\n Inside Characteristics: " + JSON.stringify(charReadResponse);
          $logService.Log(JSON.stringify(charReadResponse));
          return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "63400001-1A1E-5704-0A53-844BD14254A1", characteristic: "63400003-1A1E-5704-0A53-844BD14254A1"})
        })
        .then(function(response) {
          $scope.model.message += "\n Inside Read 00003: " + JSON.stringify(response);
          $scope.model.message += "value 00003: --- " + $cordovaBluetoothle.encodedStringToBytes(response.value);
          return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "63400001-1A1E-5704-0A53-844BD14254A1", characteristic: "63400002-1A1E-5704-0A53-844BD14254A1"})
        })
        .then(function(response) {
          $scope.model.message += "read 00002: " + JSON.stringify(response)
          $scope.model.message += "value 00002: --- " + $cordovaBluetoothle.encodedStringToBytes(response.value);
        })
        .catch(function(err) {
          $logService.Log('error', 'failed ReadFriends: ' + JSON.stringify(err));
          $scope.model.message += "Error: " + JSON.stringify(err);
        });
        return true;
      };
      $scope.startup();

    }]);
