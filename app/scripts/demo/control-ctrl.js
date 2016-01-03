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

      var SET_LED = "2a50152c-412b-49c9-e57e-520dfd5ea929";

      $scope.target = null;
      $scope.serviceUuids = [ ];
      $scope.characteristicUuid = undefined;
      $scope.devices.selected = DeviceService.devices.selected;

      var connectStack = $scope.devices.selected;

      $scope.familiarize = function() {
        familiarize(connectStack[0]);
      }

      function familiarize(device) {
        console.log('Familiarizing ourselves with', device.address);
        $scope.target = device;

        var address = { address: device.address };

        $cordovaBluetoothle.connect(address).then(function(conn) {

          if(conn.status === "connected") {

            console.log('Device is connected');
            $cordovaBluetoothle.services(address).then(function(service) {

              if(service && service.serviceUuids) {

                $scope.serviceUuids[device.address] = service.serviceUuids[0];
                var charRequest = {
                  address: device.address,
                  serviceUuid: $scope.serviceUuids[device.address]
                }
                console.log('Obtained service UUID.');
                console.log('Requesting:');
                console.log(charRequest);
                $cordovaBluetoothle.characteristics(charRequest).then(function(chars) {
                  var cmd = 0x01;
                  var bytes = $cordovaBluetoothle.stringToBytes(cmd);
                  var enc = $cordovaBluetoothle.bytesToEncodedString(bytes);

                  var writeParams = {
                    value: enc,
                    serviceUuid: $scope.serviceUuids[device.address],
                    characteristicUuid: SET_LED,
                    address: device.address
                  }
                  $cordovaBluetoothle.write(writeParams).then(function(resp) {
                    console.log('Write success')
                    console.log(resp);
                  }, function(err) {
                    console.log('Write error');
                    console.log(err);
                  });
                }, function(err) {
                  console.log('Error retrieving characteristics:');
                  console.log(err);
                })
              }
              else {
                console.log('Unexpected results from services request');
              }
              console.log(service);
            });
          }
          else if(conn.status === "connecting") {
            // TODO: wait?
            console.log('Device is connecting...');
          }
          else {
            console.log('Device is not connected.');
          }
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
      $scope.singleNewFriend = function(device){
        $scope.target = device;
        return write(0x02);
      };
      $scope.singleFriendsNear = function(device) {
        $scope.target = device;
        return write(0x03);
      };
      $scope.singleParty = function(device) {
        $scope.target = device;
        return write(0x05)
      };
      $scope.singleReset = function(device) {
        // TODO: what is best here? disconnect/reconnect? Probably.
      };
      $scope.singleMessage = function(device) {
        $scope.target = device;
        return write(0x04);
      };
      $scope.toggleLink = function(device) {

      };

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
