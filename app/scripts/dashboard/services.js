'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService', function() {
    return {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        },
        GetAppId : function(stubId) {
          return stubId || '';
        },
        SetAppId : function() {
          //stub call to local storage and Parse.
        },
        GetDevices : function() {
         //open BLE
         //throw BLEError if not connected
         //return devices
        }
    };
});
