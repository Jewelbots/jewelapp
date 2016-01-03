'use strict';
angular
	.module('jewelApp.controllers')
	.controller('ControlCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$logService',
		'DeviceService',
		function(
    $scope,
    $cordovaBluetoothle,
    $logService,
    DeviceService) {

      $scope.devices = {
        detected: [ ],
        selected: [ ]
      }

		}
	])
;
