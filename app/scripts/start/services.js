'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('UserService', function() {
    return {
      AgreedToPrivacyPolicy : function() {
        return false; //STUB; replace with Parse.com call. toggle to manually test different states.
      },
      HasBirthday : function () {
        return false; // STUB; replace with LocalStorageCall
      }
    };
  });
