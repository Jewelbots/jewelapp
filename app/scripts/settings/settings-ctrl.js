'use strict';
angular.module('jewelApp.controllers')
  .controller('SettingsCtrl',
              ['$logService','$scope', 'SettingsService', 'DataService',
                function($logService, $scope, SettingsService, DataService){
   $scope.model = {
    messages: [],
    settings : {
      mockBle : false,
      mockTelephone : false,
      telephoneNumber : DataService.GetPhoneNumber(),
      bleAddress : DataService.GetDeviceId()
    }
   };
   $scope.deleteLog = function () {
    $logService.Clear();
    $scope.model.messages = $logService.Get('all');
   };
   $scope.updateSettings = function () {
    SettingsService.SetSettings($scope.model.settings);
   };
   $scope.startUp = function () {
    $scope.model.messages = $logService.Get('all');
    $scope.model.settings = SettingsService.GetSettings();
   };
   $scope.unPair = function () {
      DataService.UnPair();
    };
   $scope.startUp();
  }]);
