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
				setTimeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 1000);
			};
		}
	])
;
