'use strict';
angular.module('jewelApp.services')
  .factory('UserService',
  ['$cordovaBluetoothle',
    '$ionicPlatform',
    '$logService',
    '$q',
    '$timeout',
    'CryptoJS',
    'DataService',
    'Parse',
    function (
      $cordovaBluetoothle,
      $ionicPlatform,
      $logService,
      $q,
      $timeout,
      CryptoJS,
      DataService,
      Parse) {
      var self = this;
      var service = {
        AgreedToPrivacyPolicy : function () {
          return DataService.AgreedToPrivacyPolicy();
        },
        SetPrivacyPolicy : function (valueSet) {
          DataService.SetPrivacyPolicy(valueSet);
        },
        GetFriends : function () {
          return DataService.GetFriends();
        },
        HasFriends : function () {
          if (self.GetFriends() > 0) {
            return true; //yes, I know I shouldn't return true; there's more coming.
          }
          else if (self.IsRegistered()) { //no friends in app; check online in case new app install
            return DataService.HasFriends();
          }
          else { //can't check online, and locally has no friends. Say no friends.  App should sync with jewelbot after every action; so assume this is up to date
            return false;
          }
        },
        SendFriendRequests : function (request) {
          var q = $q.defer();
          DataService.GetDailySalt().then(function(salt) {
            var FriendRequest = Parse.Object.extend('FriendRequests');
            var requests = [];
            var requestorDeviceId = DataService.GetDeviceId();
            var requestorHash = CryptoJS.PBKDF2(DataService.GetPhoneNumber(), salt, {keySize: 256 / 32, iterations: 100000});
            for (var i = 0; i < request.friends.length; i = i+1) {
              var r = new FriendRequest();
              r.set('RequestorHash', requestorHash);
              r.set('RecipientHash', CryptoJS.PBKDF2(request.friends[i].phoneNumber, salt, {keySize: 256 / 32, iterations: 100000}));
              r.set('Color', request.color);
              r.set('RequestorDeviceId', requestorDeviceId);
              requests.push(r);
              //send parse.com request
            }
            Parse.Object.saveAll(requests, {
              success : function (objs) {
                console.table(objs);
                q.resolve(objs);
              },
              error : function (error) {
                q.reject(error);
              }
            });


          });
          return q.promise;
        },
        IsRegistered : function () {
          return DataService.IsRegistered();
        },
        HasPhoneNumber : function () {
          return DataService.HasPhoneNumber();
        },
        SetPhoneNumber : function (unHashedNumber) {
          DataService.SetPhoneNumber(unHashedNumber);
        }
      };
      return service;
    }]);

