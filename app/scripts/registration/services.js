'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService',['$ionicPlatform', '$cordovaBluetoothle', '$timeout', '$logService', '$q', function($ionicPlatform, $cordovaBluetoothle, $timeout, $logService, $q) {
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
        GetDevices : function (params) {
          var d = $q.defer;
          $ionicPlatform.ready(function () {
            if (!$cordovaBluetoothle.isInitialized) {

              $cordovaBluetoothle.initialize()
                .then(function (re) {
                  $logService.LogMessage('ble initialized:\n' + JSON.stringify(re));
                  $cordovaBluetoothle.startScan(params)
                    .then(function (response) {
                      $logService.LogMessage('scan:\n' + JSON.stringify(response));
                      if (response.status === 'scanResult') {
                        $logService.LogMessage('result of scan:\n' + JSON.stringify(response));
                        d = response;
                      }
                      else {
                        $logService.LogMessage('still scanning:\n' + JSON.stringify(response));
                      }
                    },
                    function (error) {
                      $logService.LogError(error, 'Failed to Start Scan');
                      d = error;
                    });
                }, function (error) {
                  $logService.LogError(error, 'Failed to initialize');
                  d = error;
                });
            }
            return d.promise;
          });
        },
        Pair : function () {
          return 'success'; //Stubbed. Thanks <strike>Obama</strike> Apple Dev Center being down.
        }

    };
}]);
