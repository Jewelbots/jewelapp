'use strict';
angular.module('jewelApp.services')
.factory('JewelbotService',
  [ '$cordovaBluetoothle',
    '$ionicPlatform',
    '$logService',
    '$timeout',
  function(
    $cordovaBluetoothle,
    $ionicPlatform,
    $logService,
    $timeout
    ) {
    var service = {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        },
        GetAppId : function (stubId) {
          return stubId || '';
        },
        SetAppId : function () {
          //stub call to local storage and Parse.
        },
        Pair : function (device) {
          var result = $cordovaBluetoothle.initialize({'request': true})
          .then(function (response) {
            if (response.status === 'enabled') {
              var connected = $timeout($cordovaBluetoothle.connect({'address': device.address})
                .then(function (connectedResponse) {
                  return true;
                },
                function (failed) {
                  return false;
                }) , 15000);
            }
          });
          return result;
      }
    };
    return service;
}]);
