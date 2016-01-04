'use strict';
angular.module('jewelApp.services')
	.factory(
		'DeviceService', [
		'$cordovaBluetoothle',
		'SettingsService',
		'$logService',
		'ionicReady',
		function(
		$cordovaBluetoothle,
		SettingsService,
		$logService,
		ionicReady
) {

			var svc = { };

			svc.devices = {
				detected: [ ],
				selected: [ ],
				paired: [ ],
			};
			svc.numSelected = 0;
			svc.numDetected = 0;
			svc.isScanning = false;

			svc.getAvailableDevices = function () {
				return ionicReady()
          .then(initialize)
					.then(processResults, scanError)
					.then(endScan)
					;
			};

			svc.selectDevice = function (selected) {
				if(svc.isSelected(selected)) { return; }
				svc.devices.selected.push(selected);
				$logService.Log('message', 'Selecting device: ', selected.address);
				tally();
			};

			svc.deselectDevice = function(deselected) {
				svc.devices.selected.forEach(function (device, i) {
					if(device.name === deselected.name) {
						svc.devices.selected.splice(i, 1);
						$logService.Log('message', 'Deselecting device: ' + deselected.address);
					}
					else {
						$logService.Log('message', 'Attempted to deselect unselected device: ' +	deselected.address);
					}
					tally();
				});
			};

			svc.isSelected = function(selected) {
				var sel = svc.devices.selected.filter(function (device) {
					if(device.name === selected.name) { return true; }
				});
				return !!sel.length;
			};

			function initialize() {
				$logService.Log('message', 'Ionic platform ready. Initializing BLE.');
				return $cordovaBluetoothle.initialize()
					.then(startScan, initializeError);
			}

			function startScan() {
				$logService.Log('message', 'BLE Initialized. Starting scan.');
				svc.isScanning = true;
				return $cordovaBluetoothle.startScan(params);
			}

			function endScan() {
				$logService.Log('message', 'Ending BLE scan.');
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
					$logService.Log('message',
						'Detected ' + device.address + '.'
					);
				});

				$logService.Log('message',
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
				$logService.Log('message',
					'Error ' + type + ' BLE.'
				);
				$logService.Log('message', err);
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
