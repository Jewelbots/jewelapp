'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('DataService', ['$localStorage', function($localStorage) {
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
  }])
  .factory('UserService',['$ionicPlatform', '$cordovaBluetoothle', '$timeout', '$logService','DataService', function($ionicPlatform, $cordovaBluetoothle, $timeout, $logService, DataService) {
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
        //var salt = DataService.GetDeviceId();
        //var hashedPhoneNumber = CryptoJS.PBKDF2(unHashedNumber, salt, { keySize: 128/32 });
        //DataService.SetPhoneNumber(unHashedNumber);
      }
    };
    return service;
  }]);

