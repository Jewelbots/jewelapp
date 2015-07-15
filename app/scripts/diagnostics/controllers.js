'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',['$scope', '$logService', function($scope, $logService) {
    $scope.model = {
      log : [],
      isPaired : false
    };
    $scope.getLoggingInfo = function() {
      $scope.model.errorMessages = $logService.GetErrors();
      $scope.model.messages = $logService.GetMessages();
    };
  }]);
