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
        $logService.Log('Asking about these services:');
        $logService.Log(uuids);
        $cordovaBluetoothle.retrieveConnected({
          serviceUuids: uuids
        }).then(function(res) {
          $logService.Log('show Paired call succeeded:');
          $logService.Log(res);
          $q.resolve(res);
        }, function(err) {
          $logService.Log('show Paired call failed.');
          $logService.Log(err);
          $q.reject(err);
        });

        return $q.promise;
      };

      $scope.isPaired = function(device) {
        var uuids = [ ];
        var val = $q.defer();
      };

      function familiarize(device) {
        $logService.Log('Familiarizing ourselves with', device.address);
        $scope.target = device;

        var address = { address: device.address };

        $cordovaBluetoothle.connect(address).then(function(conn) {

          if(conn.status === 'connected') {

            $logService.Log('Device is connected');
            $cordovaBluetoothle.services(address).then(function(service) {

              if(service && service.serviceUuids) {

                $logService.Log('Device has ' + service.serviceUuids.length, ' services');
                $logService.Log(device.serviceUuids);
                $scope.serviceUuids[device.address] = service.serviceUuids[0];
                var charRequest = {
                  address: device.address,
                  serviceUuid: $scope.serviceUuids[device.address]
                };
                $logService.Log('Obtained service UUID.');
                $logService.Log('Requesting:');
                $logService.Log(charRequest);
                $cordovaBluetoothle.characteristics(charRequest).then(function(chars) {
                  $logService.Log('Received characteristics:');
                  $logService.Log(chars);

                }, function(err) {
                  $logService.Log('Error retrieving characteristics:');
                  $logService.Log(err);
                });
              }
              else {
                $logService.Log('Unexpected results from services request');
              }
              $logService.Log(service);
            });
          }
          else if(conn.status === 'connecting') {
            // TODO: wait?
            $logService.Log('Device is connecting...');
          }
          else {
            $logService.Log('Device is not connected.');
          }
        });

        function connected(device) {
          $logService.Log('Connected to', device.address);
          return services()
            .then(serviced, svcErr)
          ;
        }

        function serviced(svc) {
          $logService.Log('Found services', svc);
          return characteristics()
            .then(characters, charErr)
          ;
        }

        function characters(char) {
          $logService.Log('Received characteristics');
          $logService.Log(char);
        }

        function connErr(err) { $logService.Log('Error connecting to ', device.address); }
        function charErr(err) { $logService.Log('Error getting characteristics from ', device.address); }
        function svcErr(err) { $logService.Log('Error getting services from ', device.address); }
      }

      $scope.numSelected = function() {
        return DeviceService.numSelected;
      };

      // <!-- Individual Commands -->
      $scope.singlePair = function(device) {
        $logService.Log('single pair');
        return write(1, device);
      };
      $scope.singleNewFriend = function(device){
        $logService.Log('single new friend');
        return write(2, device);
      };
      $scope.singleFriendsNear = function(device) {
        $logService.Log('single friends near');
        return write(3, device);
      };
      $scope.singleParty = function(device) {
        $logService.Log('single party mode');
        return write(5, device);
      };
      $scope.singleMessage = function(device) {
        $logService.Log('single message');
        return write(4, device);
      };
      $scope.singleReset = function(device) {
        // TODO: what is best here? disconnect/reconnect? Probably.
        $logService.Log('Resetting');

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
        $logService.Log('Allocating array');
        var bytes = new Uint8Array(1);
        var address = device.address;
        var serviceUuid = $scope.serviceUuids[address];

        bytes[0] = data;
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
          $logService.Log(err);
        }
        try {
          $cordovaBluetoothle
            .isConnected({ address: address })
            .then(connected, disconnected)
          ;
        }
        catch(e) {
          $logService.Log('OH GOD');
          $logService.Log(e);
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
