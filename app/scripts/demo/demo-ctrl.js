'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$ionicPlatform',
		'$logService',
    '$state',
    'DeviceService',
		function(
    $scope,
    $cordovaBluetoothle,
    $ionicPlatform,
    $logService,
    $state,
    DeviceService) {
      var params = {
        request: true,
        scanDuration: 15000,
        name: 'JWB_'
      };

      $scope.devices = {
        detected: [ ],
        selected: [ ]
      }

      $scope.scanForDevices = function() {
        DeviceService.getAvailableDevices()
          .then(update)
          .then(stopRefresh);
      };

      $scope.selectDevice = function(device) {
        if (DeviceService.isSelected(device)) {
          return DeviceService.deselectDevices(device);
        }
        DeviceService.selectDevice(device);
      }

      $scope.numDetected = function() {
        return DeviceService.numDetected;
      };

      $scope.numSelected = function() {
        return DeviceService.numDetected;
      };

     	$scope.getDeviceColor = function(device) {
				return DeviceService.isSelected(device) ? 'item-calm' : 'item-light';
			};

      $scope.display = function(device) {
        return device.name || 'unnamed device' + ' ' + device.address;
      }

      function update() {
        $scope.devices.detected = DeviceService.devices.detected;
        $scope.devices.selected = DeviceService.devices.selected;
      }

      var stopRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
      };
  	}
	])
;
