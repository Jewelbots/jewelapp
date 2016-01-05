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
    '$q',
		function(
    $scope,
    $cordovaBluetoothle,
    $logService,
    DeviceService,
    ionicReady,
    $timeout,
    $q) {
      var modes = {
        pairing : 1,
        successPair : 2,
        friendInProximity: 3,
        messaging : 4,
        rainbow: 5,
        weatherSunny : 6,
        weatherRainy: 7
      };
      $scope.devices = {
        detected: [ ],
        selected: [ ],
        linked: [ ],
      };

      var SET_LED = '2a50152c-412b-49c9-e57e-520dfd5ea929';

      $scope.serviceUuids = { };
      $scope.characteristicUuid = undefined;
      $scope.devices.selected = DeviceService.devices.selected;

      var connectStack = $scope.devices.selected;

      $scope.familiarize = function() {
        familiarize(connectStack[0]);
      };

      function familiarize(device) {
        $logService.Log('Familiarizing ourselves with', device.address);

        var address = { address: device.address };

        return $cordovaBluetoothle.connect(address).then(function(conn) {

          if(conn.status === 'connected') {

            $logService.Log('Device is connected');
            return $cordovaBluetoothle.discover(address);
          }
          else {
            $logService.Log('Device is not connected.');
          }
        }).then(function(results) {
          if(results.status === 'discovered') {
            $logService.Log('Device has been discovered:');
            $logService.Log('Services:');
            $logService.Log(results.services);

            $scope.serviceUuids[device.address] = results.services[0].serviceUuid;
          }
        }, function(error) {
          $logService.Log('Discovery FAILURE:');
          $logService.Log(error);

        }).then(function() {
          $cordovaBluetoothle.disconnect(address);
        });
      }

      $scope.numSelected = function() {
        return DeviceService.numSelected;
      };

      // <!-- Individual Commands -->
      $scope.singlePair = function(device) {
        $logService.Log('single pair');
        return write(modes.successPair, device);
      };
      $scope.singleNewFriend = function(device){
        $logService.Log('single new friend');
        return write(modes.successPair, device);
      };
      $scope.singleFriendsNear = function(device) {
        $logService.Log('single friends near');
        return write(modes.friendInProximity, device);
      };
      $scope.singleParty = function(device) {
        $logService.Log('single party mode');
        return write(modes.rainbow, device);
      };
      $scope.singleMessage = function(device) {
        $logService.Log('single message');
        return write(modes.messaging, device);
      };
      $scope.singleReset = function(device) {
        // TODO: what is best here? disconnect/reconnect? Probably.
        $logService.Log('Resetting');

        // $cordovaBluetoothle.disconnect
      };
      $scope.toggleLink = function(device) {

      };

      // Global Commands
      $scope.globalPair = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.pairing, device);
        });
      };
      $scope.globalNewFriend = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.successPair, device);
        });
      };
      $scope.globalFriendsNear = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.friendInProximity, device);
        });
      };
      $scope.globalMessage = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.messaging, device);
        });
      };
      $scope.globalParty = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.rainbow, device);
        });
      };
      $scope.globalReset = function() {
        $scope.devices.selected.forEach(function (device, i) {
          write(modes.weatherSunny, device);
        });
      };

      //<!-- Linked Commands -->
      $scope.linkedPair = function() { };
      $scope.linkedNewFriend = function() { };
      $scope.linkedFriendsNear = function() { };
      $scope.globalMessage = function() { };
      $scope.linkedParty = function() { };

      // TODO: wrap in isConnected/connect/reconnect logic
      function write(data, device) {

        $logService.Log('Allocating array');
        var bytes = new Uint8Array(1);
        var address = device.address;
        var serviceUuid = $scope.serviceUuids[address];
        console.log('serviceUuid:');
        console.log(serviceUuid);
        bytes[0] = data;

        $cordovaBluetoothle
          .isConnected({ address: address })
          .then(connected, disconnected)
        ;

        function connected(conn) {
          $logService.Log('isConnected call successful...');
          $logService.Log(conn);
          if(conn.isConnected) {
            $logService.Log('Device is supposedly connected.');
            return doWrite();
          }
          else {
            $logService.Log('Device is not connected.');
            $cordovaBluetoothle.reconnect({ address: address })
              .then(reconSuccess, reconFailure);
          }
        }
        var writeParams = {
          value: $cordovaBluetoothle.bytesToEncodedString(bytes),
          serviceUuid: serviceUuid,
          characteristicUuid: SET_LED,
          address: address
        };
        $logService.Log('Write parameters:');
        $logService.Log(writeParams);
        function disconnected(err) {
          // whoops, connect for the first time maybe?
          $logService.Log('Call to isConnected failed.');

          if(err.error === 'neverConnected') {
            $logService.Log('Never connected to device.');
            $cordovaBluetoothle.connect({ address: address })
              .then(function(conn) {
                if(conn.status === 'connected') {
                  $timeout(function() {
                    write(data, device);
                  }, 500);
                }
                else {
                  $logService.Log('Connect had some trouble:');
                  $logService.Log(conn);
                }
              }, function(err) {
                $logService.Log('Connect error:');
                $logService.Log(err);
              });
          }
          $logService.Log(err);
        }

        function reconSuccess(results) {
          $logService.Log('Reconnect call successful');
          $logService.Log(results);
          if(results.status === 'connected') {
            $logService.Log('Device is connected now.');
            discover();
            // doWrite();
          }
          else if(results.status === 'connecting') {
            // TODO: max retries. UI alert when failed.
            $logService.Log('Device isn\'t yet connected. Trying again in 500ms.');
            $timeout(function() {
              write(data, device);
            }, 500);
          }
          else { // disconnected
            $logService.Log('Device is not connected/connecting...');
            $logService.Log(results);
          }
        }
        function reconFailure(err) {
          $logService.Log('Call to reconnect failed.');
          $logService.Log(err);
        }

        function reconnect() {
          $logService.Log('Attempting to reconnect...');
          $cordovaBluetoothle
            .reconnect({ address: device.address })
            .then(writeIfReconnected, reconError)
          ;
        }
        function disconnect() {
          $logService.Log('Received disconnect call...');
          return $cordovaBluetoothle.disconnect({ address: address})
            .then(function(status) {
              $logService.Log('Disconnect call successful:');
              $logService.Log(status);
            }, function(error) {
              $logService.Log('Couldn\'t disconnect.');
              $logService.Log(error);
            }
          );
        }

        function discover() {
          return $cordovaBluetoothle.services({ address: address })
            .then(function(res) {
              var charRequest = {
                address: address,
                serviceUuid: serviceUuid
              };
              return $cordovaBluetoothle.characteristics(charRequest);
            }, function(err) {
              $logService.Log('Discovering services failed.');
              $logService.Log(err);
            }).then(function(results) {
              $logService.Log('Discovered characteristics.');
              $logService.Log(results);
              doWrite();
            }, function(error) {
              $logService.Log('Error with characteristics.');
              $logService.Log(error);
            });
        }
        function doWrite() {
          $logService.Log('Writing ' + data + ' to ' + address);
          return $cordovaBluetoothle.write(writeParams)
            .then(disconnect, writeError);
        }
        function writeError(err) {
          $logService.Log('Write error:');
          $logService.Log(err);
        }
        function writeIfReconnected(recon) {
          if(recon.status === 'connected') {
            $logService.Log('Device has been reconnected.');
            doWrite();
          }
          else {
            $logService.Log('Error reconnecting, status:', recon.status);
          }
        }

        function reconError(err) {
          $logService.Log('Error reconnecting:');
          $logService.Log(err);
        }
      }

      function characteristics(dev) { return ble('characteristics', dev); }
      function isConnected(dev) { return ble('isConnected', dev); }
      function disconnect(dev) { return ble('disconnect', dev); }
      function services(dev) { return ble('services', dev); }
      function connect(dev) { return ble('connect', dev); }

      function ble(method, device) {
        return $cordovaBluetoothle[method]({ address: device.address });
      }

      function writable(elm) {
        return elm.properties && elm.properties.write;
      }
		}
	])
;
