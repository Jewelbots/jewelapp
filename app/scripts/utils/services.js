'use strict';
angular.module('jewelbots.utils', [])
  .factory('$localStorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage.setItem(key, value);
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
      Clear: function () {
        $localStorage.setObject('LogServiceError', {});
        $localStorage.setObject('LogServiceWarning', {});
        $localStorage.setObject('LogServiceMessage', {});
      },
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

        var errorLog = $localStorage.getObject('LogServiceError');
        if(Object.keys(errorLog).length === 0) {
          newErrorLog.Errors.push(error);
          $localStorage.setObject('LogServiceError', newErrorLog);
        }
        else {
          errorLog.Errors.push(error);
          $localStorage.setObject('LogServiceError', errorLog);
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
        var warningLog = $localStorage.getObject('LogServiceWarning');
        if (Object.keys(warningLog).length === 0) {
          newWarningLog.Warnings.push(warning);
          $localStorage.setObject('LogServiceWarning', newWarningLog);
        }
        else {
          warningLog.Warnings.push(warning);
          $localStorage.setObject('LogServiceWarning', warningLog);
        }
      },
      LogMessage : function (message) {
        var messages = $localStorage.getObject('LogServiceMessage');
        if (Object.keys(messages).length === 0) {
          $localStorage.setObject('LogServiceMessage', { Messages: [message]});
        }
        else {
          messages.Messages.push(message);
          $localStorage.setObject('LogServiceMessage', messages);
        }
      },
      GetErrors : function () {
        var errors = $localStorage.getObject('LogServiceError');
        return errors.Errors;
      },
      GetWarnings : function () {
        var warnings = $localStorage.getObject('LogServiceWarning');
        return warnings.Warnings;
      },
      GetMessages : function () {
        var messages = $localStorage.getObject('LogServiceMessage');
        return messages.Messages;

      }
    };
  }]);
