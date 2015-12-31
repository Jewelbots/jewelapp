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
			var defaults = {
        request : true,
			  scanDuration : 5000
			};
			svc.devices = {
				detected: [ ],
				selected: [ ],
				paired: [ ],
			};
			var fakeBluetooth = false;
			svc.numSelected = 0;
			svc.numDetected = 0;

			svc.scanForDevices = function scanForDevices(params) {
				if(fakeBluetooth) {
					console.log('Faking');
					return fakeScan();
				}
				var scanParams = params || defaults;

				return $ionicPlatform.ready()
				  .then(function doScan() {
				    $logService.Log('message', 'got into initialize for scan');
					  return $cordovaBluetoothle.initialize(scanParams)
					    .then(function () {
                $logService.Log('message', 'got into start scan');
						    return $cordovaBluetoothle.startScan(scanParams);
					  }, function (err) {
						  $logService.Log('message', 'Error initializing BLE in DemoCtrl: ' + JSON.stringify(err));
					  });
				}).then(function scanResults(data) {
				  $logService.Log('message', 'found device! : ' + JSON.stringify(data));
					if(data.status === 'scanResult') {
						svc.devices.detected.push(data);
						return $cordovaBluetoothle.stopScan();
					}
				}, function scanError(error) {
					$logService.Log('error', 'Error scanning for BLE devices in DemoCtrl.' + JSON.stringify(error));
					//stopRefresh();
					return $cordovaBluetoothle.stopScan();
				},function (notify) {
				  $logService.Log('message', 'Begun Scanning ' + JSON.stringify(notify));
				});
			};

			svc.isSelected = function isSelected(device) {
				var sel = svc.devices.selected.filter(function(item) {
					if (device.name === item.name) { return true; }
				});
				return !!sel.length;
			};

			svc.selectDevice = function selectDevice(selected) {
				if(svc.isSelected(selected)) { return; }
				svc.devices.selected.push(selected);
				svc.numSelected = svc.devices.selected.length;
			};

			svc.deselectDevice = function deselectDevice(deselected) {
				svc.devices.selected.forEach(function(device, i) {
					if(device.name === deselected.name) {
						svc.devices.selected.splice(i, 1);
					}
				});
				svc.numSelected = svc.devices.selected.length;
			};

			function fakeScan() {
				var dfd = $q.defer();
				svc.devices.detected = [ ];
				svc.devices.detected.push({ name: 'JWB_001LOL', address: 'A1:B2:C3:D4:E5:F6' });
				svc.devices.detected.push({ name: 'JWB_002WAT', address: 'A2:B3:C4:D5:E6:F0' });
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
