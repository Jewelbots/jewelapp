'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		function($scope, $cordovaBluetoothle) {
			$scope.model = {
				pairedDevices: [ ],
				detectedDevices: [ ],
				numDetected: 0,
			};
			$scope.devices = [ ];
			$scope.scanForDevices = function scanForDevices() {

				// scan for nearby BLE devices here, ones with JWB_ prefix
				setTimeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 1000);
			};
		}
	])
;
