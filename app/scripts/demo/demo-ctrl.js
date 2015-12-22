'use strict';
angular.module('jewelApp.controllers')
	.controller('DemoCtrl', [
		'$scope',
		'$window',
		function($logService, $scope, $window) {
			$scope.model = {
				pairedDevices: [ ],
			};
			$scope.getLoggingInfo = function() {
				var logs = 'hi'
				$window.console.log(logs);
				$scope.$broadcast('scroll.refreshComplete');
			};
			$scope.clearLog = function () {
				$logService.Clear();
			};
		}
	])
;
