'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',[
  '$logService',
  '$scope',
  '$window',
  'DataService',
  'UserService',
  'JewelbotService',
  'DeviceService',
  function(
  $logService,
  $scope,
  $window,
  DataService,
  UserService,
  JewelbotService,
  DeviceService
  ) {
    $scope.model = {
      logs : [],
      isPaired : DataService.IsPaired(),
      deviceId : DataService.GetDeviceId()
    };
    $scope.getLoggingInfo = function() {
      var logs = $logService.Get('all');
      $window.console.log(logs);
      $scope.model.logs = logs;
      $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.getLoggingInfo();

    $scope.clearLog = function () {
      $logService.Clear();
    };
  }]);
