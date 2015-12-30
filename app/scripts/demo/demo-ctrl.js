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
				console.log('Selecting device ' + device.name);
				DeviceService.selectDevice(device);
			}
			function isSelected(device) {
				var sel = $scope.devices.selected.filter(function(item) {
					if(device.name == item.name) { return true; }
					return false;
				});
				return !!sel.length;
			}
			function unselectDevice(device) {
				$scope.devices.selected.forEach(function(item, i) {
					if(item.name == device.name) {
						$scope.devices.selected.splice(i, 1);
					}
				});
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
