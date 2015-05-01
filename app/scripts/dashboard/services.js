'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
.factory('JewelbotService', function() {
    return {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        },
        GetDeviceId : function(stubId) {
          return stubId || '';
        },
        SetDeviceId : function() {
          //stub call to local storage and Parse.
        }
    };
});
