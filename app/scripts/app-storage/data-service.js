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
        HasFriends : function () {
          var friendsObject = $localStorage.getObject('Friends');
          return !(Object.keys(friendsObject).length === 0 || friendsObject.friends.length === 0);
        },
        GetFriends: function () {
          var friendsObject = $localStorage.getObject('Friends');
          if (Object.keys(friendsObject).length === 0) {
            return [];
          }
          return friendsObject.friends;
        },
        SetFriends: function (friends) {
          var friendsObject = {
            friends: friends
          };
          $localStorage.setObject('Friends', friendsObject);
        },
        AddFriend : function (friendRequest) {
          var q = $q.defer();
          try {
            //todo: add friendRequest.Address to device
            var friends = this.GetFriends();
            var friendsObject=  {
              friends : friends
            };
            friendsObject.friends.push(friendRequest);
            $localStorage.setObject('Friends', friendsObject);
            q.resolve(friendRequest);
          }
          catch (error) {
            q.reject(error);
          }
          return q.promise;


        },
        IsPaired : function () {
          return $localStorage.get('Connection', '').length > 0;
        },
        Pair : function (address) {
          $localStorage.set('Connection', address);
        },
        UnPair : function () {
          $localStorage.set('Connection', '');
        },
        GetDeviceId : function () {
          return $localStorage.get('Connection', '');
        },
        GetDailySalt : function () {
          var q = $q.defer();
          try {
            Parse.Cloud.run('latestSalt').then(function (result) {
              $logService.Log('message', 'got salt! ' + JSON.stringify(result));
              var salt = {};
              salt.salt = result.get('salt');
              salt.id = result.id;
              q.resolve(salt);
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
        GetAllSalts : function () {
          var q = $q.defer();
          Parse.Cloud.run('allSalts').then(function (result) {
          var salts = [];
          for (var i = 0; i < result.length; i=i+1) {
            salts.push(result[i].get('salt'));
          }
            q.resolve(salts);
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
        GetPhoneNumber : function () {
          return $localStorage.get('PhoneNumber', '');
        },
        AgreedToPrivacyPolicy : function () {
          return $localStorage.get('acceptPrivacyPolicy') === true;
        },
        SetPrivacyPolicy : function (valueSet) {
          $localStorage.set('acceptPrivacyPolicy', valueSet);
        },
        SetSettings : function (settings) {
          $localStorage.setObject('settings', settings);
        },
        GetSettings : function () {
          return $localStorage.getObject('settings', {});
        },
        GetFirmwareVersion : function () {
          return $localStorage.getObject('firmwareVersion', '');
        },
        SetFirmwareVersion : function (version) {
          $localStorage.setObject('firmwareVersion', version);
        },
        GetLatestFirmwareVersion : function() {
          //TODO: this will need a server-side implementation with DFU feature
        }
      };
      return service;
    }]);
