'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		function($scope, $cordovaBluetoothle, $logService) {
			$scope.devices = {
				detected: [ ],
				selected: [ ],
				paired: [ ]
			}
			$scope.numDetected = 0;
			$scope.numSelected = 0;

			$scope.selectDevice = function selectDevice(device) {

				if(isSelected(device)) { return unselectDevice(device); }
				$scope.devices.selected.push(device);
				$scope.numSelected = $scope.devices.selected.length;
			}
			$scope.scanForDevices = function scanForDevices() {

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
		}
	])
;
