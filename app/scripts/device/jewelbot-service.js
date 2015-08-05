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
            $logService.Log('message', 'Response was: ' + JSON.stringify(response));
            if (response.status === 'enabled') {
              var connected = $timeout($cordovaBluetoothle.connect({'address': device.address})
                .then(function (connectedResponse) {
                  $logService.Log('message', 'connected!: ' + JSON.stringify(connectedResponse));
                  return true;
                },
                function (failed) {
                  $logService.Log('error', 'failed to pair: ' + JSON.stringify(failed));
                  return false;
                }) , 15000);
              $logService.Log('error', 'JSON Connected: ' + JSON.stringify(connected));
            }
          });
          return result;
      }
    };
    return service;
}]);
