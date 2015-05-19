'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService',['$cordovaBluetoothle', '$timeout', function($cordovaBluetoothle, $timeout) {
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
          $timeout($cordovaBluetoothle.startScan()
            .then(function (response) {
                result = response;
              },
              function (error) {
                result = error;
              }), 500)
          .then(function () {
            $cordovaBluetoothle.stopScan();
          });
          return result;
        }

    };
}]);
