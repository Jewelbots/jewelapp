'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('DataService', [
    '$localStorage',
    '$logService',
    '$q',
    'Parse',
    function(
      $localStorage,
      $logService,
      $q,
      Parse) {
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
        GetDailySalt : function () {
          var q = $q.defer();
          Parse.initialize('aRsOu0eubWBbvxFjPiVPOnyXuQjhgHZ1sjpVAvOM', 'p8qy8tXJxME6W7Sx5hXiHatfFDrmkNoXWWvqksFW');
          Parse.Cloud.run('latestSalt').then(function (result) {
            q.resolve(result);
          }, function(error) {
            $logService.Log('error', 'can\'t get salt');
            q.reject(error);
          });
          return q.promise;
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
