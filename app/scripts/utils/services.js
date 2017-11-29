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
      Log : function (type, message, obj) {
        var log = $localStorage.getObject(logKey);
        if (!log.hasOwnProperty('Messages')) {
          log.Messages = [];
        }
        if (typeof type === 'string' && message === undefined && obj === undefined) { //console.log('')
          log.Messages.push({Type: 'message', Message: type, Timestamp: new Date().toUTCString()});
        }
        else if (typeof type === 'object' && message === undefined && obj === undefined) { //console.log(obj);
          log.Messages.push({Type: 'message', Message: JSON.stringify(type), Timestamp: new Date().toUTCString()});
        }
        else if (obj !== undefined) {
          message = message + JSON.stringify(obj);
          log.Messages.push({Type: 'message', Message: JSON.stringify(message), Timestamp: new Date().toUTCString()});
        }
        else  {
          log.Messages.push({Type: type, Message: message, Timestamp: new Date().toUTCString()});
        }
        console.log(JSON.stringify(Array.prototype.slice.call(arguments), null, 2));
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
  }])
  .factory('ionicReady', ['$ionicPlatform', function ($ionicPlatform) {
    var readyPromise;

    return function () {
      if (!readyPromise) {
        readyPromise = $ionicPlatform.ready();
      }
      return readyPromise;
    }
  }]);
