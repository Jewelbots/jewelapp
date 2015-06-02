'use strict';
angular.module('jewelApp.services')//Todo: Implement Parse.com calls
  .factory('UserService', ['$localStorage', function($localStorage) {
    return {
      AgreedToPrivacyPolicy : function() {
        return $localStorage.getItem('acceptPrivacyPolicy') === true;
      },
      SetPrivacyPolicy : function (valueSet) {
        $localStorage.set('acceptPrivacyPolicy', valueSet);
      },
      HasBirthday : function () {
        console.log($localStorage.get('birthday'));
        return $localStorage.get('birthday') !== null;
      },
      SetBirthday : function(birthday) {
        console.log($localStorage.get('birthday'));
        $localStorage.set('birthday', birthday);
      },
      GetBirthday : function() {
        console.log($localStorage.get('birthday'));
        return $localStorage.get('birthday');
      }
    };
  }]);
