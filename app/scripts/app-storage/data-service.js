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
          try {
            Parse.initialize('j5XHG7wZ7z62lWCT4H43220C31slqlbswptPkbbU', '5qEip2ImNHArKNdWDnC3SYNjxFpSQG3vkZ1UOjR6');
            Parse.Cloud.run('latestSalt').then(function (result) {
              $logService.Log('message', 'got salt! ' + JSON.stringify(result));
              q.resolve(result[0].get('salt'));
            }, function(error) {
              $logService.Log('error', 'can\'t get salt');
              q.reject(error);
            });
            return q.promise;
          }
          catch(err) {
            $logService.Log('error', 'failed to run salt ' + JSON.stringify(err));
          }
        },
        HasPhoneNumber : function () {
          return $localStorage.get('PhoneNumber', '').length > 0;
        },
        SetPhoneNumber : function (number) {
          return $localStorage.set('PhoneNumber', number);
        },
        GetPhoneNumber : function () {
          return $localStorage.get('PhoneNumber', '');
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
