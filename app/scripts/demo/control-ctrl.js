'use strict';
angular
	.module('jewelApp.controllers')
	.controller('ControlCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		'DeviceService',
		function(
    $scope,
    $cordovaBluetoothle,
    $logService,
    DeviceService) {

      $scope.devices = {
        detected: [ ],
        selected: [ ]
      }

      $scope.target = null;

      $scope.devices.selected = DeviceService.devices.selected;

      var connectStack = $scope.devices.selected;

      $scope.familiarize = function() {
        familiarize(connectStack[0]);
      }

      function familiarize(device) {
        console.log('Familiarizing ourselves with', device.address);
        $scope.target = device;

        var address = { address: device.address };

        $cordovaBluetoothle.isConnected(address).then(function() {
          console.log('already connected');
        }, function() {
          console.log('not connected');
        });

        function connected(device) {
          console.log('Connected to', device.address);
          return services()
            .then(serviced, svcErr)
          ;
        }

        function serviced(svc) {
          console.log('Found services', svc);
          return characteristics()
            .then(characters, charErr)
          ;
        }

        function characters(char) {
          console.log('Received characteristics');
          console.log(char);
        }

        function connErr(err) { console.log('Error connecting to', device.address); }
        function charErr(err) { console.log('Error getting characteristics from', device.address); }
        function svcErr(err) { console.log('Error getting services from', device.address); }
      }

      $scope.numSelected = function() {
        return DeviceService.numSelected;
      }
      // <!-- Individual Commands -->
      $scope.singlePair = function(device) {
        $scope.target = device;
        return write(0x01);
      };
      $scope.singleNewFriend = function(device){ };
      $scope.singleFriendsNear = function(device) { };
      $scope.singleParty = function(device) { };
      $scope.singleReset = function(device) { };
      $scope.toggleLink = function(device) { };

      // Global Commands
      $scope.globalPair = function() { };
      $scope.globalNewFriend = function() { };
      $scope.globalFriendsNear = function() { };
      $scope.globalMessage = function() { };
      $scope.globalParty = function() { };
      $scope.globalReset = function() { };

      //<!-- Linked Commands -->
      $scope.linkedPair = function() { };
      $scope.linkedNewFriend = function() { };
      $scope.linkedFriendsNear = function() { };
      $scope.globalMessage = function() { };
      $scope.linkedParty = function() { };

      // TODO: wrap in isConnected/connect/reconnect logic
      function write(data) {
        return $cordovaBluetoothle.write({
          value: data,
          serviceUuid: $scope.serviceUuid,
          characteristicUuid: $scope.characteristicUuid,
        });
      }

      function isConnected() { return ble('isConnected', $scope.target); }
      function connect() { return ble('connect', $scope.target); }
      function services() { return ble('services', $scope.target); }

      function ble(method, device) {
        return $cordovaBluetoothle[method]({ address: device.address });
      }
		}
	])
;
