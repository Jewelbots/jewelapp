'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('UserService', ['$window', function($window) {
    return {
      AgreedToPrivacyPolicy : function() {
        return $window.localStorage.getItem('acceptPrivacyPolicy') === true;
      },
      SetPrivacyPolicy : function (valueSet) {
        $window.localStorage.setItem('acceptPrivacyPolicy', valueSet);
      },
      HasBirthday : function () {
        console.log($window.localStorage.getItem('birthday'));
        return $window.localStorage.getItem('birthday') !== null;
      },
      SetBirthday : function(birthday) {
        console.log($window.localStorage.getItem('birthday'));
        return $window.localStorage.setItem('birthday', birthday);
      },
      GetBirthday : function() {
        console.log($window.localStorage.getItem('birthday'));
        return $window.localStorage.getItem('birthday');
      }
    };
  }]);
