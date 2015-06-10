'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService',['$ionicPlatform', '$cordovaBluetoothle', '$timeout', '$logService', function($ionicPlatform, $cordovaBluetoothle, $timeout, $logService) {
    return {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        },
        GetAppId : function (stubId) {
          return stubId || '';
        },
        SetAppId : function () {
          //stub call to local storage and Parse.
        },
        GetDevices : function () {
          var result;
          $ionicPlatform.ready(function () {
            $cordovaBluetoothle.initialize()
              .then(function() {
                $timeout($cordovaBluetoothle.startScan()
                  .then(function (response) {
                    result = response;
                  },
                  function (error) {
                    $logService.LogError(error, "Failed to Start Scan");
                    result = error;
                  }), 500)
                  .then(function () {
                    $cordovaBluetoothle.stopScan();
                  })
              }, function(error) {
                $logService.LogError(error, "Failed to initialize");
                result = error;
              });
            return result;
          });
        },
        Pair : function () {
          return 'success'; //Stubbed. Thanks <strike>Obama</strike> Apple Dev Center being down.
        }

    };
}]);
