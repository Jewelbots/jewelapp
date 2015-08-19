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
        CheckFriendRequests : function () {
          Parse.initialize('aRsOu0eubWBbvxFjPiVPOnyXuQjhgHZ1sjpVAvOM', 'p8qy8tXJxME6W7Sx5hXiHatfFDrmkNoXWWvqksFW');
          var q = $q.defer();
          var phoneNumber = DataService.GetPhoneNumber();
          DataService.GetAllSalts().then(function (result) {
            var hashedPossibles = [];
            for (var i = 0; i < result.length; i = i + 1) {
              hashedPossibles.push(CryptoJS.PBKDF2(phoneNumber, result[i], {
                keySize: 256 / 32,
                iterations: 10
              }).toString());
            }
            var params = {
              recipientHashes : hashedPossibles
            };
            Parse.Cloud.run('outstandingRequests', params).then(function (result) {
              q.resolve(result);
            }, function (error) {
              q.reject(error);
            }); //TODO: success/fail
          });
          return q.promise;

        },
        SendFriendRequests : function (request) {
         try {
           Parse.initialize('aRsOu0eubWBbvxFjPiVPOnyXuQjhgHZ1sjpVAvOM', 'p8qy8tXJxME6W7Sx5hXiHatfFDrmkNoXWWvqksFW');
           var q = $q.defer();
           var requests = [];
           var saltId = '';
           var Salt = Parse.Object.extend('Salts');
           $logService.Log('message', 'entering sendFriendRequests' + JSON.stringify(request));
           DataService.GetDailySalt().then(function (result) {
             $logService.Log('message', 'inside of then for dailySalt ' + JSON.stringify(result));
             var FriendRequest = Parse.Object.extend('FriendRequests');
             var salt = result;
             var requestorDeviceId = DataService.GetDeviceId();
             saltId = salt.id;
             $logService.Log('message', 'inside of requestorDeviceId ' + JSON.stringify(requestorDeviceId));
             var requestorHash = CryptoJS.PBKDF2(DataService.GetPhoneNumber(), salt.salt, {
               keySize: 256 / 32,
               iterations: 10
             }).toString();
             for (var i = 0; i < request.friends.length; i = i + 1) {
               $logService.Log('message', 'Entering loop to send friends');
               var r = new FriendRequest();
               r.set('RequestorHash', requestorHash.toString());
               var recipientHash = CryptoJS.PBKDF2(request.friends[i], salt.salt, {
                 keySize: 256 / 32,
                 iterations: 10
               }).toString();
               $logService.Log('message', 'Entered Loop: requestorHash '+ JSON.stringify(requestorHash));
               r.set('RecipientHash', recipientHash.toString());
               r.set('Color', request.color);
               r.set('RequestorDeviceId', requestorDeviceId);
               requests.push(r);
             }
           }).then(function () {
             Parse.Object.saveAll(requests, {
               success: function (objs) {
                 for (var i = 0; i < objs.length; i=i+1) {
                  var salt = new Salt({id: saltId});
                  objs[i].set("Salts", salt);
                  objs[i].save();
                 }
                 q.resolve(objs);
               },
               error: function (error) {
                 $logService.Log('error', 'error saving requests: ' + JSON.stringify(error));
                 q.reject(error);
               }
             });
           });
           return q.promise;
         }
         catch (error) {
          $logService.Log('had error sending friends: ' + JSON.stringify(error));
         }
        },
        IsRegistered : function () {
          return DataService.IsRegistered();
        },
        HasPhoneNumber : function () {
          return DataService.HasPhoneNumber();
        },
        SetPhoneNumber : function (unHashedNumber) {
          DataService.SetPhoneNumber(unHashedNumber);
        },
        GetPhoneNumber : function () {
          return DataService.GetPhoneNumber();
        }
      };
      return service;
    }]);

