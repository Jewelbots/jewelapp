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
        telephone: ''
      };
      var getPhoneNumbers = function (r) {
        var phoneNumbersArray = r.phoneNumbers;
        var phoneNumbers = _.pluck(phoneNumbersArray, 'value');
        return phoneNumbers;
      };
      var getFirstName = function (r) {
        if (r.name.givenName === null || r.name.givenName.length === 0 || r.name.givenName.trim() === '') { return; }
        return {
          givenName: r.name.givenName.trim(),
          familyName: ((typeof r.name.familyName === 'string' || r.name.familyName instanceof String) && r.name.familyName.length > 0) ? r.name.familyName.charAt(0) : '',
          phoneNumbers: getPhoneNumbers(r)

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
        $logService.Log('message', 'entering find Friends?' + JSON.stringify(color));
        $logService.Log('message', 'menu.selectedMenuItem is: ' + JSON.stringify($scope.menu.selectedMenuItem));
        $logService.Log('message', 'selectedMenuItem is: ' + JSON.stringify($scope.selectedMenuItem));
        $ionicPlatform.ready().then( function () {
          return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers'], multiple:true}).then(function (success) {
            _.forEach(success, function (p) {
              $scope.model.contacts.push(getFirstName(p));
            });
            $scope.model.contacts = $scope.model.contacts.sort(function (obj1, obj2) {
              return obj1.givenName < obj2.givenName;
            });
            
            $logService.Log('message', 'success is : ' + JSON.stringify($scope.model.contacts));
          });
        });
      };
      $scope.addFriends = function() {
        //var selectedContacts = _.where($scope.model.contacts,{ checked : true });
        //Parse.Storage();
        var selectedItem = $scope.menu.selectedMenuItem;
        $logService.Log('message', 'selectedMenuItem is: ' + selectedItem);
        $scope.modal.hide();
      };
      $scope.sendSMS = function (telephone) {
        console.log('model telephone is + ' + $scope.model.telephone);
        console.log('telephone is: ' + telephone);
        $state.go('sms-verification-screen', { telephone: telephone});
      };
      $scope.startUp();
    }]);
