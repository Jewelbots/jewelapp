'use strict';
angular.module('jewelApp.services')
  .factory('SettingsService',
  ['$cordovaBluetoothle',
    'ionicReady',
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
      ionicReady,
      $logService,
      $q,
      $timeout,
      ContactsService,
      CryptoJS,
      DataService,
      Parse,
      _) {
      var self = this;
      var options = {
        mockBle : false,
        mockTelephone : false,
        telephoneNumber : undefined,
        bleAddress : undefined
      };
      var service = {
        GetSettings : function () {
          var settings = _.merge({},options, DataService.GetSettings());
          settings.telephoneNumber = this.GetPhoneNumber();
          settings.bleAddress = this.GetDevice();
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
          return DataService.GetPhoneNumber();
        },
        Get : function() {
          return DataService.GetSettings();
        },
        SetDevice : function (bleAddress) {
          DataService.Pair(bleAddress);
        },
        GetDevice : function () {
          return DataService.GetDeviceId();
        }
      };
      return service;
    }]);

