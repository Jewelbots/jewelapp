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
        $localStorage.setObject('JewelbotsLogger', {});
      },
      Log : function (type, message) {
        var log = $localStorage.getObject('JewelbotsLogger');
        log.Messages.push({Type: type, Message: message, Timestamp: Date.now()});
        $localStorage.setObject('JewelbotLogger', log);
      },
      Get : function (type) {
        var logs = $logStorage.getObject('JewelbotsLogger');
        if (type !== 'all' || type.length > 0) {
          return _.pluck(_.where(logs.Messages, {'Type': type.toLowerCase()}));
        }
        return logs.Messages;
      }
    };
  }]);
