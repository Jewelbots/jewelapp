'use strict';
angular.module('jewelApp.controllers')
  .controller('DiagnosticCtrl',['$scope', 'JewelbotService', '$logService', function($scope, JewelbotService, $logService) {
    var jewelModel = {},
      devices = [],
      i = 0,
      d,
      deviceString = '',
      propName;
    $scope.jewelModel = {};
    $scope.getErrors = function() {
      $scope.Errors = $logService.GetErrors();
    };
    $scope.Errors = {};
    jewelModel.isPaired = JewelbotService.IsPaired();
    //devices = JewelbotService.GetDevices();
    devices = [];
    for(i = 0; i < devices.length; i = i + 1) {
      d = devices[i];
      for (propName in devices[i]) {
        deviceString += 'Property Name -> ' + propName + ' : Value -> ' + d[propName] + '\n';
      }
    }
    jewelModel.devices = deviceString;
    $scope.jewelModel = jewelModel;
  }]);
