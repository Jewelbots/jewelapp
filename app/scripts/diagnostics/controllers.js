'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',['$scope', 'JewelbotService',  function($scope, JewelbotService) {
    var jewelModel = {};
    $scope.jewelModel = {};

    jewelModel.isPaired = JewelbotService.IsPaired();
    jewelModel.devices = JewelbotService.GetDevices();
    $scope.jewelModel = jewelModel;
  }]);
