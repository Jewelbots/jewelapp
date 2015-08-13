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
      };

      $scope.allowedToAddFriends = function () {
        return UserService.HasPhoneNumber();
      };
      $scope.hasFriends = function() {

        $logService.Log('message', 'entering has friends');
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
        $logService.Log('message', 'person is: '+ JSON.stringify(person));
        if (person.name.givenName.length === 0) {
           $logService.Log('message', 'wasn\'t a person' + JSON.stringify(person));
          return '';
        }
        var firstName = person.name.givenName;
        var familyName = ((typeof person.name.familyName === 'string' || person.name.familyName instanceof String) && person.name.familyName.length > 0) ? person.name.familyName.charAt(0) + '.' : '';
        $logService.Log('message', 'is: ' + JSON.stringify(person));
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
      $scope.findFriendsToAdd = function(color) {

        $scope.model.color = color;
        $ionicPlatform.ready().then( function () {
          return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers'], multiple:true}).then(function (success) {
            $logService.Log('message', 'number of contacts: ' + success.length.toString());
            _.forEach(success, function (p) {
              $scope.model.contacts.push(collapseNames(p));
            });
            $scope.model.contacts = $scope.model.contacts.sort(function(a, b){
              $logService.Log('message', 'a name is: ' + a.name);
              $logService.Log('message', 'b name is: ' + b.name);
              if(a.name < b.name) { return -1; }
              if(a.name > b.name) { return 1; }
              return 0;
            });
            $logService.Log('message', 'success is : ' + JSON.stringify($scope.model.contacts));
          });
        });
      };
      $scope.addFriends = function() {
        $scope.model.selectedContacts = _.where($scope.model.contacts,{ checked : true });
        var phones = _.pluck($scope.model.selectedContacts, 'phoneNumbers');
        //phonenumber
        //color;
        var selectedItem = $scope.menu.selectedMenuItem;
        $logService.Log('message', 'selectedMenuItem is: ' + selectedItem);

        UserService.SendFriendRequests({color : $scope.menu.selectedMenuItem, friends : _.map(phones, _.values)}).then(function (success) {
          $logService.Log('message', 'success for Send Friend Requests ' + JSON.stringify(success));
          $scope.modal.hide();
        }, function (error) {
          $logService.Log('error', 'could not add friends: ' + JSON.stringify(error));
        });

      };
      $scope.sendSMS = function (telephone) {
        console.log('model telephone is + ' + $scope.model.telephone);
        console.log('telephone is: ' + telephone);

        $state.go('sms-verification-screen', { telephone: telephone});
      };
      $scope.startUp();
    }]);
