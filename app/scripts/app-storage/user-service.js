'use strict';
angular.module('jewelApp.services')
  .factory('UserService',
  ['$cordovaBluetoothle',
    '$ionicPlatform',
    '$logService',
    '$timeout',
    'DataService',
    function (
      $cordovaBluetoothle,
      $ionicPlatform,
      $logService,
      $timeout,
      DataService) {
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

        IsRegistered : function () {
          return DataService.IsRegistered();
        },
        HasPhoneNumber : function () {
          return DataService.HasPhoneNumber();
        },
        SetPhoneNumber : function (unHashedNumber) {
          $logService.Log('message', 'unhashed number is ' + unHashedNumber);
          //var salt = DataService.GetDeviceId();
          //var hashedPhoneNumber = CryptoJS.PBKDF2(unHashedNumber, salt, { keySize: 128/32 });
          //DataService.SetPhoneNumber(unHashedNumber);
        }
      };
      return service;
    }]);

