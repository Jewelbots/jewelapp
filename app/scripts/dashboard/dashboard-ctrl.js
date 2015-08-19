'use strict';
angular.module('jewelApp.controllers')
.controller('DashboardCtrl',
  [
    '$cordovaContacts',
    '$cordovaDialogs',
    '$ionicModal',
    '$ionicPlatform',
    '$logService',
    '$scope',
    '$state',
    '$stateParams',
    'UserService',
    '_',
    function(
      $cordovaContacts,
      $cordovaDialogs,
      $ionicModal,
      $ionicPlatform,
      $logService,
      $scope,
      $state,
      $stateParams,
      UserService,
      _
    ) {
      $scope.startUp = function () {

        if ($stateParams.src === 'phoneVerification') {
          $cordovaDialogs.alert('', 'Your phone number has been verified', 'OK');
          delete $stateParams.src;
        }
        $ionicModal.fromTemplateUrl('templates/friends/add-friends.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
        });
        $scope.model.phoneNumber = UserService.GetPhoneNumber();
        $scope.checkFriendRequests();
      };

      $scope.allowedToAddFriends = function () {
        return UserService.HasPhoneNumber();
      };
      $scope.hasFriends = function() {
        return UserService.HasFriends();
      };
      $scope.menu = {
        selectedMenuItem : ''
      };
      $scope.model = {
        contacts : [],
        selectedContacts : [],
        telephone: ''
      };
      var getPhoneNumbers = function (r) {
        var phoneNumbers = _.pluck(r, 'value');
        return phoneNumbers;
      };
      //var getFirstName = function (r) {
      //  if (r.name.givenName === null || r.name.givenName.length === 0 || r.name.givenName.trim() === '') { return; }
      //  return {
      //    givenName: r.name.givenName.trim(),
      //    familyName: ((typeof r.name.familyName === 'string' || r.name.familyName instanceof String) && r.name.familyName.length > 0) ? r.name.familyName.charAt(0) : '',
      //    phoneNumbers: getPhoneNumbers(r)
      //
      //  };
      //};

      var collapseNames = function(person) {

        if (person.name.givenName.length === 0) {
           $logService.Log('message', 'wasn\'t a person' + JSON.stringify(person));
          return '';
        }
        var firstName = person.name.givenName;
        var familyName = ((typeof person.name.familyName === 'string' || person.name.familyName instanceof String) && person.name.familyName.length > 0) ? person.name.familyName.charAt(0) + '.' : '';
        return {
          name : (firstName + ' ' + familyName).trim(),
          phoneNumber : getPhoneNumbers(person.phoneNumbers)//person.name.phoneNumber[0].value //todo: add all phone numbers
        };
      };


      $scope.openModal = function (color) {
        $scope.modal.show();
        $scope.findFriendsToAdd(color);
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      $scope.checkFriendRequests = function () {
        UserService.CheckFriendRequests().then(function (results){
          $scope.model.outstandingFriendRequests = results.length;
        });

      }

      $scope.findFriendsToAdd = function(color) {
        $scope.model.selectedMenuItem = color;
        if (ionic.Platform.platform() === 'macintel' ) {
          $scope.model.contacts.push(
            {name: 'Billy B.', phoneNumber: ['7031111323', '7045111111']},
            {name: 'Mary S.', phoneNumber: ['17034443333', '9702502579']},
            {name: 'TJ', phoneNumber: ['7035551212']},
            {name: 'George S', phoneNumber: ['7039157702']}
          );
        }

        $ionicPlatform.ready().then( function () {
          return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers'], multiple:true}).then(function (success) {
            $logService.Log('message', 'number of contacts: ' + success.length.toString());
            $logService.Log('message', '100 is: '+ JSON.stringify(success[99]));
            $logService.Log('message', '***************************************');
            $logService.Log('message', '1 is: '+ JSON.stringify(success[0]));
            $logService.Log('message', '***************************************');
            $logService.Log('message', '25 is: '+ JSON.stringify(success[25]));
            $logService.Log('message', '***************************************');
            _.forEach(success, function (p) {
              $scope.model.contacts.push(collapseNames(p));
            });
            $scope.model.contacts = $scope.model.contacts.sort(function(a, b){
              if(a.name < b.name) { return -1; }
              if(a.name > b.name) { return 1; }
              return 0;
            });
          });
        });
      };
      $scope.addFriends = function() {
        $scope.model.selectedContacts = _.where($scope.model.contacts,{ checked : true });
        $logService.Log('message', 'selected Contacts are: ' + JSON.stringify($scope.model.selectedContacts));
        var phones = _.chain($scope.model.selectedContacts)
          .pluck('phoneNumber')
          .flatten('phoneNumber')
          .value(); //todo: alpha: remove + sign from number
        $logService.Log('message', 'phones selected are: ' + JSON.stringify(phones));

        UserService.SendFriendRequests({color : $scope.menu.selectedMenuItem, friends : phones}).then(function (success) {
          $logService.Log('message', 'success for Send Friend Requests ' + JSON.stringify(success));
          $scope.modal.hide();
        }, function (error) {
          $logService.Log('error', 'could not add friends: ' + JSON.stringify(error));
        });

      };
      $scope.sendSMS = function (telephone) {
        $state.go('sms-verification-screen', { telephone: telephone});
      };
      $scope.startUp();
    }]);
