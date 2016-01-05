'use strict';
angular
	.module('jewelApp.controllers')
	.controller('ControlCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		'DeviceService',
    'ionicReady',
    '$timeout',
		function(
    $scope,
    $cordovaBluetoothle,
    $logService,
    DeviceService,
    ionicReady,
    $timeout) {

      $scope.devices = {
        detected: [ ],
        selected: [ ],
        linked: [ ],
      };

      var SET_LED = '2a50152c-412b-49c9-e57e-520dfd5ea929';

      $scope.target = null;
      $scope.serviceUuids = { };
      $scope.characteristicUuid = undefined;
      $scope.devices.selected = DeviceService.devices.selected;

      var connectStack = $scope.devices.selected;

      $scope.familiarize = function() {
        familiarize(connectStack[0]);
      };

      $scope.getPaired = function() {

        var uuids = [ ];
        var val = $q.defer();

        for(var id in $scope.serviceUuids) {
          uuids.push($scope.serviceUuids[id]);
        }
        console.log('Asking about these services:');
        console.log(uuids);
        $cordovaBluetoothle.retrieveConnected({
          serviceUuids: uuids
        }).then(function(res) {
          console.log('show Paired call succeeded:');
          console.log(res);
          $q.resolve(res);
        }, function(err) {
          console.log('show Paired call failed.');
          console.log(err);
          $q.reject(res);
        });

        return $q.promise;
      };

      $scope.isPaired = function(device) {
        var uuids = [ ];
        var val = $q.defer();


      }

      function familiarize(device) {
        console.log('Familiarizing ourselves with', device.address);
        $scope.target = device;

        var address = { address: device.address };

        $cordovaBluetoothle.connect(address).then(function(conn) {

          if(conn.status === 'connected') {

            console.log('Device is connected');
            $cordovaBluetoothle.services(address).then(function(service) {

              if(service && service.serviceUuids) {

                console.log('Device has', service.serviceUuids.length, 'sevices');
                console.log(device.serviceUuids);
                $scope.serviceUuids[device.address] = service.serviceUuids[0];
                var charRequest = {
                  address: device.address,
                  serviceUuid: $scope.serviceUuids[device.address]
                };
                console.log('Obtained service UUID.');
                console.log('Requesting:');
                console.log(charRequest);
                $cordovaBluetoothle.characteristics(charRequest).then(function(chars) {
                  console.log('Received characteristics:');
                  console.log(chars);

                }, function(err) {
                  console.log('Error retrieving characteristics:');
                  console.log(err);
                });
              }
              else {
                console.log('Unexpected results from services request');
              }
              console.log(service);
            });
          }
          else if(conn.status === 'connecting') {
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
      };

      // <!-- Individual Commands -->
      $scope.singlePair = function(device) {
        console.log('single pair');
        return write(1, device);
      };
      $scope.singleNewFriend = function(device){
        console.log('single new friend');
        return write(2, device);
      };
      $scope.singleFriendsNear = function(device) {
        console.log('single friends near');
        return write(3, device);
      };
      $scope.singleParty = function(device) {
        console.log('single party mode');
        return write(5, device);
      };
      $scope.singleMessage = function(device) {
        console.log('single message');
        return write(4, device);
      };
      $scope.singleReset = function(device) {
        // TODO: what is best here? disconnect/reconnect? Probably.
        console.log('Resetting');

        // $cordovaBluetoothle.disconnect
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
      function write(data, device) {
        console.log('Allocating array');
        var bytes = new Uint8Array(1);
        var address = device.address;
        var serviceUuid = $scope.serviceUuids[address];
        console.log('Setting service UUID');
        bytes[0] = data;
        console.log('Filling bytes.');
        var writeParams = {
          value: $cordovaBluetoothle.bytesToEncodedString(bytes),
          serviceUuid: serviceUuid,
          characteristicUuid: SET_LED,
          address: address
        }

        doWrite();

        // $cordovaBluetoothle
        //   .connect({ address: $target.address })
        //   .then(doWrite, reconnect)
        // ;

        function reconnect() {
          console.log('Attempting to reconnect...');
          $cordovaBluetoothle
            .reconnect({ address: $target.address })
            .then(writeIfReconnected, reconError)
          ;
        }

        function doWrite() {
          console.log('Writing', data, 'to', address);
          return $cordovaBluetoothle.write(writeParams)
            .then(disconnect, writeError);
        }
        function writeError(err) {
          console.log('Write error:');
          console.log(err);
        }

        function writeIfReconnected(recon) {
          if(recon.status === 'connected') {
            console.log('Device has been reconnected.');
            doWrite();
          }
          else {
            console.log('Error reconnecting, status:', recon.status);
          }
        }

        function reconError(err) {
          console.log('Error reconnecting:');
          console.log(err);
        }
      }

      function isConnected() { return ble('isConnected', $scope.target); }
      function connect() { return ble('connect', $scope.target); }
      function services() { return ble('services', $scope.target); }

      function ble(method, device) {
        return $cordovaBluetoothle[method]({ address: device.address });
      }

      function writable(elm) {
        return elm.properties && elm.properties.write;
      }
		}
	])
;
