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

      var previouslyConnectedDevices = { };

      var SET_LED = '2a50152c-412b-49c9-e57e-520dfd5ea929';
      var SEPARATOR = '--------------------------------------------------------';
      $scope.serviceUuids = { };
      $scope.characteristicUuid = undefined;
      $scope.devices.selected = DeviceService.devices.selected;

      function send(data, device) {
        $logService.Log('send called...');
        var thisAddress = device.address;
        var specialData = _encode(data);
        var serviceUuid = undefined;

        var formalAddress = { address: thisAddress };

        $logService.Log('formalAddress is as follows:');
        $logService.Log(formalAddress);

        // Start here, friendly interpreter!

        $logService.Log('Starting promise chain, weeeeee~!1');
        initializeTheDeviceAt(thisAddress)
          .then(areWeStillConnected, errorHandler)
          .then(discoverWhatItCanDo, errorHandler)
          .then(writeTheDataToItNow, errorHandler)
          .then(disconnectFromItNow, errorHandler)
        ;

        function initializeTheDeviceAt(theAddressSpecified) {
          $logService.Log(SEPARATOR);
          $logService.Log('initializeTheDevice called for ' + theAddressSpecified);


          var a = $q.defer();
          if(previouslyConnectedDevices[theAddressSpecified]) { // reconnecting
            $cordovaBluetoothle.reconnect(formalAddress).then(function(conn) {
              if(conn.status === 'connected') {
                $logService.Log('initializeTheDevice reconnected.');
                a.resolve(device);
              }
              else if(conn.status === 'connecting') {
                $logService.Log('initializeTheDevice still reconnecting...');
                a.reject({ error: 'stillConnecting' });
              }
            }, function(err) {
              $logService.Log('initializeTheDevice reconnect error:');
              $logService.Log(err);
              a.reject(err);
            });
          }
          else { // initial connect
            $cordovaBluetoothle.connect(formalAddress).then(function(conn) {
              if(conn.status === 'connected') {
                previouslyConnectedDevices[thisAddress] = true;
                $logService.Log('initializeTheDevice connected.');
                a.resolve(device);
              }
              else if(conn.status === 'connecting') {
                $logService.Log('initializeTheDevice still connecting...');
                a.reject({ error: 'stillConnecting' });
              }
            }, function(err) {
              $logService.Log('initializeTheDevice connect error:');
              $logService.Log(err);
              a.reject(err);
            });
          }
          return a.promise;
        }

        function areWeStillConnected() {
          var a = $q.defer();
          $logService.Log(SEPARATOR);
          $logService.Log('areWeStillConnected called...');
          $cordovaBluetoothle.isConnected(formalAddress).then(function(res) {
            $logService.Log('areWeStillConnected succeeded.');
            if(res.isConnected) {
              $logService.Log('CONNECTED');
              a.resolve(device);
            }
            else {
              $logService.Log('NOT CONNECTED');
              a.reject({ error: 'connectFailed' });
            }
          }, function(error) {
            $logService.Log('areWeStillConnected error:');
            $logService.Log(error);
            a.reject(error);
          });

          return a.promise;
        }
        function discoverWhatItCanDo() {
          $logService.Log(SEPARATOR);
          $logService.Log('discoverWhatItCanDo called for ' + thisAddress);
          var a = $q.defer();
          $cordovaBluetoothle.discover(formalAddress).then(function(discovery) {
            if(discovery.status !== 'discovered') {
              $logService.Log('discoverWhatItCanDo discovery failed.');
              return a.reject({ error: 'notDiscovered' });
            }
            $logService.Log('discoverWhatItCanDo discovery succeeded.');
            serviceUuid = discovery.services[0].serviceUuid;
            $logService.Log('serviceUuid:', serviceUuid);
            a.resolve(device);
          }, function(error) {
            $logService.Log('discoverWhatItCanDo discovery error:');
            $logService.Log(error);
            a.reject(error);
          });
          return a.promise;
        }

        function writeTheDataToItNow() {
          $logService.Log(SEPARATOR);
          $logService.Log('writeTheDataToItNow called...');
          var a = $q.defer();
          var magicIncantation = {
            value: specialData,
            address: thisAddress,
            serviceUuid: serviceUuid,
            characteristicUuid: SET_LED
          };
          $logService.Log('magicIncantation is as follows:');
          $logService.Log(magicIncantation);
          $cordovaBluetoothle.write(magicIncantation).then(function(wrote) {
            $logService.Log('writeTheDataToItNow write success:');
            $logService.Log(wrote);
            a.resolve(device);
          }, function(error) {
            $logService.Log('writeTheDataToItNow write failure:');
            $logService.Log(error);
            a.reject(error);
          });
          return a.promise;
        }

        function disconnectFromItNow() {
          $logService.Log(SEPARATOR);
          $logService.Log('disconnectFromItNow called...');
          // TODO: need to call $cordovaBluetoothle.close()
          var a = $q.defer();
          $cordovaBluetoothle.close(formalAddress).then(function(really) {
            if(really.status === 'closed') {
              $logService.Log('disconnectFromItNow really closed.');
              $logService.Log(really);
              a.resolve(device);
            }
            else {
              $logService.Log('disconnectFromItNow failed to close.');
              $logService.Log(really);
            }
            previouslyConnectedDevices[thisAddress] = false;
          }, function(error) {
            $logService.Log('disconnectFromItNow error:');
            $logService.Log(error);
            a.reject(error);
          });
          return a.promise;
        }

        function errorHandler(error) {
          $logService.Log(SEPARATOR);
          $logService.Log('error', 'Error handler was called:');
          $logService.Log(error);
          disconnectFromItNow();
          // TODO: Logic so as to recover from various issues
        }
      }

      function _encode(data) {
        var bytes = new Uint8Array(1);
        bytes[0] = data;
        return $cordovaBluetoothle.bytesToEncodedString(bytes);
      }

      $scope.numSelected = function() {
        return DeviceService.numSelected;
      };

      // <!-- Individual Commands -->
      $scope.singlePair = function(device) {
        $logService.Log('single pair');
        return send(modes.pairing, device);
      };
      $scope.singleNewFriend = function(device){
        $logService.Log('single new friend');
        return send(modes.successPair, device);
      };
      $scope.singleFriendsNear = function(device) {
        $logService.Log('single friends near');
        return send(modes.friendInProximity, device);
      };
      $scope.singleParty = function(device) {
        $logService.Log('single party mode');
        return send(modes.rainbow, device);
      };
      $scope.singleMessage = function(device) {
        $logService.Log('single message');
        return send(modes.messaging, device);
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
          return send(modes.pairing, device);
        });
      };
      $scope.globalNewFriend = function() {
        $scope.devices.selected.forEach(function (device, i) {
          return send(modes.successPair, device);
        });
      };
      $scope.globalFriendsNear = function() {
        $scope.devices.selected.forEach(function (device, i) {
          return send(modes.friendInProximity, device);
        });
      };
      $scope.globalMessage = function() {
        $scope.devices.selected.forEach(function (device, i) {
          return send(modes.messaging, device);
        });
      };
      $scope.globalParty = function() {
        $scope.devices.selected.forEach(function (device, i) {
          return send(modes.rainbow, device);
        });
      };
      $scope.globalReset = function() {
        $scope.devices.selected.forEach(function (device, i) {
          return send(modes.weatherSunny, device);
        });
      };

      //<!-- Linked Commands -->
      $scope.linkedPair = function() { };
      $scope.linkedNewFriend = function() { };
      $scope.linkedFriendsNear = function() { };
      $scope.globalMessage = function() { };
      $scope.linkedParty = function() { };

		}
	])
;
