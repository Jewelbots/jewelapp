'use strict';
angular.module('jewelApp.services')
  .factory('ContactsService',
   ['$cordovaContacts',
    '$ionicPlatform',
    '$logService',
    '$q',
    'CryptoJS',
    'DataService',
    'Parse',
    '_',
    function (
      $cordovaContacts,
      $ionicPlatform,
      $logService,
      $q,
      $timeout,
      CryptoJS,
      DataService,
      Parse,
      _) {
      var fakeContacts = [
        {name: 'Billy B.', phoneNumber: ['7031111323', '7045111111']},
        {name: 'Mary S.', phoneNumber: ['17034443333', '9702502579']},
        {name: 'TJ', phoneNumber: ['7035551212']},
        {name: 'George S', phoneNumber: ['7039157702']}
      ];
      var getPhoneNumbers = function (r) {
        var phoneNumbers = _.pluck(r, 'value');
        return phoneNumbers;
      };


      var collapseNames = function(person) {

        if (person.name.givenName.length === 0) {
          $logService.Log('message', 'wasn\'t a person' + JSON.stringify(person));
          return '';
        }
        var firstName = person.name.givenName;
        var familyName = ((typeof person.name.familyName === 'string' || person.name.familyName instanceof String) && person.name.familyName.length > 0) ? person.name.familyName.charAt(0) + '.' : '';
        return {
          name : (firstName + ' ' + familyName).trim(),
          phoneNumber : getPhoneNumbers(person.phoneNumbers)
        };
      };
      var service = {
        GetContacts : function () {
          var q = $q.defer();
          var contactsToReturn = [];
          if (ionic.Platform.platform() === 'macintel' ) {
            q.resolve(fakeContacts);
          }
          else {
            $ionicPlatform.ready().then(function () {
              $cordovaContacts.find({
                fields: ['givenName', 'familyName', 'phoneNumbers'],
                multiple: true
              }).then(function (success) {
                _.forEach(success, function (p) {
                  contactsToReturn.push(collapseNames(p));
                });
                contactsToReturn = contactsToReturn.sort(function (a, b) {
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                });
                q.resolve(contactsToReturn);
              }, function (error) {
                q.reject(error);
              });
            }, function (error) {
              q.reject(error);
            });
          }
          return q.promise;
        }
      };
      return service;
    }]);

