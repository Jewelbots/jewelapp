'use strict';
angular.module('jewlieApp.services')//Todo: Implement Parse.com calls
.factory('JewliebotService', function() {
    return {
        IsPaired : function() {
            return false; //STUB; replace with Parse.com call. toggle to manually test different states.
        }
    };
});
