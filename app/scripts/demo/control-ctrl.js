'use strict';
angular
	.module('jewelApp.controllers')
	.controller('ControlCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		'DeviceService',
		function($scope, $cordovaBluetoothle, $logService, DeviceService) {
			$scope.devices = {
				detected: function() { return DeviceService.devices.detected; },
				selected: function() { return DeviceService.devices.selected; }
			};
			$scope.numDetected = function() { return DeviceService.numDetected; };
			$scope.numSelected = function() { return DeviceService.numSelected; };


		}
	])
;
