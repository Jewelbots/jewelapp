'use strict';
angular
	.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$cordovaBluetoothle',
		'$ionicPlatform',
		'$logService',
    '$state',
    'DeviceService',
		function(
    $scope,
    $cordovaBluetoothle,
    $ionicPlatform,
    $logService,
    $state,
    DeviceService) {
      var params = {
        request: true,
        scanDuration: 15000,
        name: 'JWB_'
      };

      $scope.devices = {
        detected: [ ],
        selected: [ ]
      }

      $scope.scanForDevices = function() {
        DeviceService.getAvailableDevices()
          .then(update)
          .then(stopRefresh);
      };

			$scope.scanForDevices = function() {
			  if (!currentlyScanning) {
          getAvailableDevices().then(function (success) {
            $logService.Log('message', 'got to success for getAvailableDevices: ' + JSON.stringify(success));
            stopRefresh();
          });
        }

			};

			$scope.selectDevice = function(device) {
          if(isSelected(device)) { return; }
          $scope.devices.selected.push(device);
			};
			$scope.deselectDevice = function(deselected) {
        $scope.devices.selected.forEach(function(device, i) {
          if(device.name === deselected.name) {
            $scope.devices.selected.splice(i, 1);
          }
        });
      };

			$scope.getDeviceColor = function(device) {
				return isSelected(device) ? 'item-calm' : 'item-light';
			};
      if ($scope.devices.detected === 0) {
        getAvailableDevices();
      }

      $scope.globalPair = function () {
      };
      $scope.globalNewFriend = function() {

      };
      $scope.globalFriendsNear = function () {

      };
      $scope.globalMessage = function () {

      };
      $scope.global Party = function () {

      };
      $scope.globalReset = function () {

      };
      //<!-- Linked Commands -->

      $scope.linkedPair = function () {

      };
      $scope.linkedNewFriend = function () {

      };
      $scope.linkedFriendsNear = function () {

      };
      $scope.globalMessage = function () {

      };
      $scope.linkedParty = function () {

      };

       // <!-- Individual Commands -->

      $scope.singlePair = function (device) {};
      $scope.singleNewFriend = function (device){};
      $scope.singleFriendsNear = function (device) {};
      $scope.singleParty = function (device) {};
      $scope.singleReset = function (device) {};
      $scope.toggleLink = function (device) {};

		}
	])
;
