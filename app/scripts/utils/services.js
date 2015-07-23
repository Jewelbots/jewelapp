'use strict';
angular.module('jewelbots.utils',[])
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
  .factory('$logService',['$localStorage', '_', function($localStorage, _) {
    var logKey = 'JewelbotsLogger';
    return {
      Clear: function () {
        $localStorage.setObject(logKey, {});
      },
      Log : function (type, message) {
        var log = $localStorage.getObject(logKey);
        if (!log.hasOwnProperty('Messages')) {
          log.Messages = [];
        }
        log.Messages.push({Type: type, Message: message, Timestamp: Date.now()});
        $localStorage.setObject(logKey, log);
      },
      Get : function (type) {
        var logs = $localStorage.getObject(logKey);
        if (type !== 'all' && type.length > 0) {
          return _.pluck(_.where(logs.Messages, {'Type': type.toLowerCase()}));
        }
        return logs.Messages;
      }
    };
  }]);
