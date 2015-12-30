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

			$scope.selectDevice = function selectDevice(device) {

				if(isSelected(device)) { return unselectDevice(device); }
				$scope.devices.selected.push(device);
				$scope.numSelected = $scope.devices.selected.length;
			}
			$scope.scanForDevices = function scanForDevices() {
				if(fakeBluetooth) { return fakeScan(); }
				// scan for nearby BLE devices here, ones with JWB_ prefix
				$ionicPlatform.ready().then(function doScan() {
					return $cordovaBluetoothle.initialize($scope.params)
					.then(function () {
						return $cordovaBluetoothle.find($scope.params)
					}, function (err) {
						$logService.log('error', 'Error initializing BTLE in DemoCtrl.');
					});
				}).then(function scanResults(data) {
					if(data.status === "scanResult") {
						$scope.devices.detected.push(data);
						stopRefresh();
						return $cordovaBluetoothle.stopScan();
					}
				}, function scanError(error) {
					$logService.log('error', 'Error scanning for BLE devices in DemoCtrl.');
					stopRefresh();
					return $cordovaBluetoothle.stopScan();
				});
			};
			$scope.getDeviceColor = function getDeviceColor(device) {
				return isSelected(device) ? "item-calm" : "item-light";
			}
			function fakeScan() {
				$scope.devices.detected = [ ];
				$scope.devices.detected.push({ name: 'JWB_001LOL', address: "A1:B2:C3:D4:E5:F6" });
				$scope.devices.detected.push({ name: 'JWB_002WAT', address: "A2:B3:C4:D5:E6:F0" });
				console.log($scope.devices.detected);
				stopRefresh();
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
			function stopRefresh() {
				$scope.numSelected = $scope.devices.selected.length;
				$scope.numDetected = $scope.devices.detected.length;
				$scope.$broadcast('scroll.refreshComplete');
			}
		}
	])
;
