'use strict';
angular.module('jewelApp.services')
.factory('JewelbotService',
  [ '$cordovaBluetoothle',
    'ionicReady',
    '$logService',
    '$timeout',
    'DataService',
  function(
    $cordovaBluetoothle,
    ionicReady,
    $logService,
    $timeout,
    DataService
    ) {
    var service = {

      IsPaired : function() {
          return DataService.IsPaired(); //STUB; replace with Parse.com call. toggle to manually test different states.
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
            $timeout($cordovaBluetoothle.connect({'address': device.address})
              .then(function (connectedResponse) {
                return $cordovaBluetoothle.read({address: device.address, service: "0xa15442d14b84530a04571e1A00004063", characteristic: "0002"}).then(function(charReadResponse){
                  $logService.Log('info', JSON.stringify(charReadResponse));
                  DataService.Pair(connectedResponse.address);
                });
                return true;
              },
              function (failed) {
                $logService.Log('error', 'failed to connect: ' + JSON.stringify(failed));
                return false;
              }) , 15000);
          }
        });
        return result;
      }
    };
    return service;
}]);
