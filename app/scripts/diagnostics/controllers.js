'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',['$scope', '$window', '$logService', function($scope, $window, $logService) {
    $scope.model = {
      logs : [],
      isPaired : false
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
