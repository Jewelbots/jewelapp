'use strict';
angular.module('jewelApp.services')
	.factory('DeviceService', [
		'$cordovaBluetoothle',
		'$ionicPlatform',
		'$logService',
		'$timeout',
		'$q',
		function($cordovaBluetoothle, $ionicPlatform, $logService, $timeout, $q) {
			var svc = { };
			svc.devices = {
				detected: [ ],
				selected: [ ],
				paired: [ ],
			}
			var fakeBluetooth = true;
			svc.numSelected = 0;
			svc.numDetected = 0;

			svc.scanForDevices = function scanForDevices(params) {
				if(fakeBluetooth) {
					console.log('Faking');
					return fakeScan();
				}
				return $ionicPlatform.ready().then(function doScan() {
					return $cordovaBluetoothle.initialize(params)
					.then(function () {
						return $cordovaBluetoothle.find(params)
					}, function (err) {
						$logService.log('error', 'Error initializing BLE in DemoCtrl.');
					});
				}).then(function scanResults(data) {
					if(data.status === "scanResult") {
						svc.devices.detected.push(data);
						return $cordovaBluetoothle.stopScan();
					}
				}, function scanError(error) {
					$logService.log('error', 'Error scanning for BLE devices in DemoCtrl.');
					stopRefresh();
					return $cordovaBluetoothle.stopScan();
				});
			}

			svc.isSelected = function isSelected(device) {
				var sel = svc.devices.selected.filter(function(item) {
					if (device.name == item.name) { return true; }
				});
				return !!sel.length;
			}

			svc.selectDevice = function selectDevice(selected) {
				if(svc.isSelected(selected)) { return; }
				svc.devices.selected.push(selected);
				svc.numSelected = svc.devices.selected.length;
			}

			svc.deselectDevice = function deselectDevice(deselected) {
				svc.devices.selected.forEach(function(device, i) {
					if(device.name == deselected.name) {
						svc.devices.selected.splice(i, 1);
					}
				});
				svc.numSelected = svc.devices.selected.length;
			}

			function fakeScan() {
				var dfd = $q.defer();
				svc.devices.detected = [ ];
				svc.devices.detected.push({ name: 'JWB_001LOL', address: "A1:B2:C3:D4:E5:F6" });
				svc.devices.detected.push({ name: 'JWB_002WAT', address: "A2:B3:C4:D5:E6:F0" });
				svc.numDetected = svc.devices.detected.length;
				setTimeout(function() {
					dfd.resolve();
				}, 1500);
				return dfd.promise;
			}
			return svc;
		}
	])
;
