var fakeBluetooth = false;
'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		'DeviceService',
		function($scope, $cordovaBluetoothle, $logService, DeviceService) {
			$scope.devices = {
				detected: function() { return DeviceService.devices.detected; },
				selected: function() { return DeviceService.devices.selected; }
			}
			$scope.numDetected = function() { return DeviceService.numDetected; }
			$scope.numSelected = function() { return DeviceService.numSelected; }

			$scope.scanForDevices = function() {
				var scan = DeviceService.scanForDevices().then(function() {
					console.log('Scanned.');
					stopRefresh();
				}, function() {
					console.log('Failed.');
					stopRefresh();
					return $cordovaBluetoothle.stopScan();
				});
			}

			$scope.selectDevice = function(device) {
				if(DeviceService.isSelected(device)) {
					return DeviceService.deselectDevice(device);
				}
				DeviceService.selectDevice(device);
			}

			$scope.getDeviceColor = function(device) {
				return DeviceService.isSelected(device) ? "item-calm" : "item-light";
			}

			function stopRefresh() {
				$scope.numSelected = $scope.devices.selected.length;
				$scope.numDetected = $scope.devices.detected.length;
				$scope.$broadcast('scroll.refreshComplete');
			}
		}
	])
;
