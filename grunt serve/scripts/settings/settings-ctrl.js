'use strict';
angular.module('jewelApp.controllers')
  .controller('SettingsCtrl', ['$logService','$scope', 'SettingsService', function($logService, $scope, SettingsService){
   $scope.model = {
    messages: [],
    settings : {
      mockBle : false,
      mockTelephone : false,
      telephoneNumber : undefined,
      bleAddress : undefined
    }
   };

   $scope.updateSettings = function () {
    SettingsService.SetSettings($scope.model.settings);
   };
   $scope.startUp = function () {
    $scope.model.messages = $logService.Get('all');
    $scope.model.settings = SettingsService.GetSettings();
   };
   $scope.startUp();
  }]);
