'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',['$scope', '$window', '$logService', function($scope, $window, $logService) {
    $scope.model = {
      log : [],
      isPaired : false
    };
    $scope.getLoggingInfo = function() {
      var logs = $logService.Get('all');
      $scope.model.log = logs;
    };

    $scope.clearLog = function () {
      $logService.Clear();
    };
  }]);
