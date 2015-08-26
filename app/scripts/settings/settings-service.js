'use strict';
angular.module('jewelApp.services')
  .factory('SettingsService',
  ['$cordovaBluetoothle',
    '$ionicPlatform',
    '$logService',
    '$q',
    '$timeout',
    'ContactsService',
    'CryptoJS',
    'DataService',
    'Parse',
    '_',
    function (
      $cordovaBluetoothle,
      $ionicPlatform,
      $logService,
      $q,
      $timeout,
      ContactsService,
      CryptoJS,
      DataService,
      Parse,
      _) {
      var options = {
        mockBle : false,
        mockTelephone : false,
        telephoneNumber : undefined,
        bleAddress : undefined
      };
      var self = this;
      var service = {
        GetSettings : function () {
          var settings = _.merge({},DataService.GetSettings(), options);
          settings.telephoneNumber = self.GetPhoneNumber();
          settings.bleAddress = self.GetDevice();
          return settings;
        },
        SetSettings : function (settings) {
          var settingsToSave = _.merge({}, options, settings);
          DataService.SetSettings(settingsToSave);
        },
        MockBle : function (shouldMock) {
          var settings = self.GetSettings();
          DataService.SetSettings(_.merge({},settings, {mockBle : shouldMock}));
        },
        MockTelephone  : function (shouldMock) {
          var settings = self.GetSettings();
          DataService.SetSettings(_.merge(settings, {mockTelephone : shouldMock}));
        },
        SetPhoneNumber : function (telephone) {
          DataService.SetPhoneNumber(telephone);
        },
        GetPhoneNumber : function () {
          DataService.GetPhoneNumber();
        },
        Get : function() {
          return DataService.GetSettings();
        },
        SetDevice : function (bleAddress) {
          DataService.Pair(bleAddress);
        },
        GetDevice : function () {
          return DataService.GetDeviceId;
        }
      };
      return service;
    }]);

