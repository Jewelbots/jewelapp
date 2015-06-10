'use strict';
angular.module('jewelbots.utils', [])
  .factory('$localStorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    };
  }])
  .factory('$logService',['$localStorage', function($localStorage) {
    return {
      LogError: function (exception, message) {
        var error = {
          Exception: exception,
          Message: message,
          Date : Date.now()
        };
        var newErrorLog = {
         Errors : [
         ]
        };

        var errorLog = $localStorage.getObject('LogService.Error');
        if(Object.keys(errorLog).length === 0) {
          newErrorLog.Errors.push(error);
          $localStorage.setObject('LogService.Error', newErrorLog);
        }
        else {
          errorLog.Errors.push(error);
          $localStorage.setObject('LogService.Error', errorLog);
        }
      },
      LogWarning: function (message) {
        var newWarningLog = {
          Warnings: []
        };
        var warning = {
          Message : message,
          Date : Date.now()
        };
        var warningLog = $localStorage.getObject('LogService.Warning');
        if (Object.keys(warningLog).length === 0) {
          newWarningLog.Warnings.push(warning);
          $localStorage.setObject('LogService.Warning', newWarningLog);
        }
        else {
          warningLog.Warnings.push(warning);
          $localStorage.setObject('LogService.Warning', warningLog);
        }
      },
      GetErrors : function () {
        var errors = $localStorage.getObject('LogService.Error');
        return errors.Errors;
      },
      GetWarnings : function () {
        var warnings = $localStorage.getObject('LogService.Warning');
        return warnings.Warnings;
      }
    };
  }]);
