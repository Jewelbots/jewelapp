'use strict';
angular.module('jewelApp.services')
	.factory(
		'DeviceService', [
		'$cordovaBluetoothle',
		'SettingsService',
		'$ionicPlatform',
		'$logService',
		'$timeout',
		'$q',
		function(
		$cordovaBluetoothle,
		SettingsService,
		$ionicPlatform,
		$logService,
		$timeout,
		$q) {

			var fakeBluetooth = false;
			var svc = { };
			var defaults = {
				request : true,
				scanDuration : 5000
			};
			svc.devices = {
				detected: [ ],
				selected: [ ],
				paired: [ ],
			};
			svc.numSelected = 0;
			svc.numDetected = 0;
			svc.isScanning = false;

			var params = {
				request: true,
				scanDuration: 5000
			};

			svc.getAvailableDevices = function () {
				return $ionicPlatform.ready()
					.then(initialize)
					.then(processResults, scanError)
					.then(endScan)
				;
			};

			svc.selectDevice = function (selected) {
				if(svc.isSelected(selected)) { return; }
				svc.devices.selected.push(selected);
				console.log('Selecting device: ', device.address);
				tally();
			};

			svc.deselectDevice = function(deselected) {
				svc.devices.selected.forEach(function (device, i) {
					if(device.name === deselected.name) {
						svc.devices.selected.splice(i, 1);
						console.log('Deselecting device: ' + deselected.address);
					}
					else {
						console.log(
							'Attempted to deselect unselected device: ' +
							deselected.address
						);
					}
					tally();
				});
			};

			svc.isSelected = function(selected) {
				var sel = svc.devices.selected.filter(function (device) {
					if(device.name === selected.name) { return true; }
				});
				return !!sel.length;
			}

			function initialize() {
				console.log('Ionic platform ready. Initializing BLE.');
				return $cordovaBluetoothle.initialize()
					.then(startScan, initializeError)
				;
			}

			function startScan() {
				console.log('BLE Initialized. Starting scan.');
				svc.isScanning = true;
				return $cordovaBluetoothle.startScan(params);
			}

			function endScan() {
				console.log('Ending BLE scan.');
				return $cordovaBluetoothle.isScanning().then(function (scanning) {
					if(scanning) {
						return $cordovaBluetoothle.stopScan().then(function() {
							svc.isScanning = false;
						});
					}
					else { svc.isScanning = false; }
				});
			}

			function processResults(dat) {

				dat.forEach(function parseResult(device) {
					if(device.status !== 'scanResult') { return; }
					addDevice(device);
					console.log(
						'Detected ' + device.address + '.'
					);
				});

				console.log(
					'Total of ' +  svc.devices.detected.length + ' devices.'
				);
			}

			function addDevice(detected) {
				var det = svc.devices.detected.filter(function (device) {
					if(device.name === detected.name) { return true; }
				});
				if(det.length) { return; }
				svc.devices.detected.push(detected);
				tally();
			}

			function error(type, err) {
				console.log(
					'Error ' + type + ' BLE.'
				);
				console.log(err);
			}

			function initializeError(err) { error('initializing', err); }
			function scanError(err) { error('scanning', err); }
			function tally() {
				svc.numSelected = svc.devices.selected.length;
				svc.numDetected = svc.devices.detected.length;
			}

			return svc;
		}
	])
;
