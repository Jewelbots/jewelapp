'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$ionicPlatform',
		'$logService',
		function($scope, $cordovaBluetoothle, $ionicPlatform, $logService) {

      $scope.devices = {
        detected: [],
        selected: []
      };
      var isSelected = function(device) {
        var sel = $scope.devices.selected.filter(function (item) {
          if (device.name === item.name) {
            return true;
          }
        });
        return !!sel.length;
      };
      var stopRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.numDetected = function() { return $scope.devices.detected.length; };
      $scope.numSelected = function() { return $scope.devices.selected.length; };

      var getAvailableDevices = function () {
        var params = {
          request: true,
          scanDuration : 10000
        };
        $ionicPlatform.ready( function () {
            $logService.Log('message', 'entered ionic ready');
            return $cordovaBluetoothle.initialize(params)
              .then(function () {
                $logService.Log('message', 'entered pre-start scan');
                return $cordovaBluetoothle.isScanning().then(function (isScanning) {
                  if (!isScanning) {
                    return $cordovaBluetoothle.startScan(params);
                  }
                });
              }, function (err) {
                $logService.Log('error', 'Error trying to initialize bluetoothle ' + JSON.stringify(err));
              })
              .then(function (data) {
                var i;
                $logService.Log('message', 'data was: ' + JSON.stringify(data));
                if (data.status === 'scanResult') {
                  for (i = 0; i < data.length; i = i + 1) {
                    if (data[i].name.slice(0, 3).toLowerCase() === 'jwb' || data[i].name.slice(0, 3).toLowerCase() === 'jew') {
                      $scope.devices.detected.push(data[i]);
                      $logService.Log('detected devices are: ' + JSON.stringify($scope.devices.detected));
                    }
                  }
                }
                return $cordovaBluetoothle.stopScan();
              }, function (error) {
                $logService.Log('error', 'Error while scanning.' + JSON.stringify(error));
                return $cordovaBluetoothle.stopScan();
              }, function (notify) {
                $logService.Log('message', 'notifying scan: ' + JSON.stringify(notify));
              })
              .then(function () {
            $logService.Log('message', 'ending scan...');
            return $cordovaBluetoothle.isScanning().then(function(isScanning) {
              if (isScanning) {
                return $cordovaBluetoothle.stopScan();
              }
            });
          });
        });
      };

			$scope.scanForDevices = function() {
			    getAvailableDevices().then(function (success) {
			      $logService.Log('message', 'got to success for getAvailableDevices: ' + JSON.stringify(success));
            stopRefresh();
			    });

			};

			$scope.selectDevice = function(device) {
          if(isSelected(device)) { return; }
          $scope.devices.selected.push(device);
			};
			$scope.deselectDevice = function(deselected) {
        $scope.devices.selected.forEach(function(device, i) {
          if(device.name === deselected.name) {
            $scope.devices.selected.splice(i, 1);
          }
        });
      };

			$scope.getDeviceColor = function(device) {
				return isSelected(device) ? 'item-calm' : 'item-light';
			};
		}
	])
;
