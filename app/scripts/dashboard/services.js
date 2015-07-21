'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('DataService', ['$localStorage', function($localStorage) {
    var self = this;
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
      SaveConnection: function (address) {
        $localStorage.set('Connection', address);
      },
      IsPaired : function () {
        return $localStorage.get('Connection', '').length > 0;
      }
    };
    return service;
  }])
  .factory('UserService',['$ionicPlatform', '$cordovaBluetoothle', '$timeout', '$logService','SettingsService', 'DataService',  function($ionicPlatform, $cordovaBluetoothle, $timeout, $logService, SettingsService, DataService) {
    var self = this;
    var service = {
      GetFriends : function () {
        return DataService.GetFriends();
      },
      HasFriends : function () {
        if (this.GetFriends() > 0) {
          return true; //yes, I know I shouldn't return true; there's more coming.
        }
        else if (this.IsRegistered()) { //no friends in app; check online in case new app install
          return DataService.HasFriends();
        }
        else { //can't check online, and locally has no friends. Say no friends.  App should sync with jewelbot after every action; so assume this is up to date
          return false;
        }
      },

      IsRegistered : function () {
        return DataService.IsRegistered();
      }
    };
    return service;
  }]);

