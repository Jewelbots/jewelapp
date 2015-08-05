'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('DataService', [
    '$localStorage',
    function(
      $localStorage) {
      var service =  {
        IsRegistered : function () {
          return $localStorage.get('IsRegistered', false);
        },
        SetRegistered : function () {
          $localStorage.set('IsRegistered', true);
        },
        HasFriends : function () {

          return Object.keys($localStorage.getObject('HasFriends')).length !== 0;
        },
        GetFriends: function () {
          return $localStorage.getObject('Friends').friends || [];
        },
        IsPaired : function () {
          return $localStorage.get('Connection', '').length > 0;
        },
        Pair : function (address) {
          $localStorage.set('Connection', address);
        },
        GetDeviceId : function () {
          return $localStorage.get('Connection', '');
        },
        HasPhoneNumber : function () {
          return $localStorage.get('PhoneNumber', '').length > 0;
        },
        SetPhoneNumber : function (number) {
          return $localStorage.set('PhoneNumber', number);
        },
        AgreedToPrivacyPolicy : function () {
          return $localStorage.get('acceptPrivacyPolicy') === true;
        },
        SetPrivacyPolicy : function (valueSet) {
          $localStorage.set('acceptPrivacyPolicy', valueSet);
        },
      };
      return service;
    }]);
