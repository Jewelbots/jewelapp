'use strict';
angular.module('jewelApp.controllers')
.controller('DashboardCtrl',
  [
    '$cordovaDialogs',
    '$ionicModal',
    '$ionicPlatform',
    '$logService',
    '$scope',
    '$state',
    '$stateParams',
    'ContactsService',
    'UserService',
    '_',
    function(
      $cordovaDialogs,
      $ionicModal,
      $ionicPlatform,
      $logService,
      $scope,
      $state,
      $stateParams,
      ContactsService,
      UserService,
      _
    )
     {
      $scope.startUp = function () {

        if ($stateParams.src === 'phoneVerification') {
          $cordovaDialogs.alert('', 'Your phone number has been verified', 'OK');
          delete $stateParams.src;
        }
        $ionicModal.fromTemplateUrl('templates/friends/add-friends.html', {
          id: '1',
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal1 = modal;
        });
        $scope.model.phoneNumber = UserService.GetPhoneNumber();
        $scope.checkFriendRequests();
        $ionicModal.fromTemplateUrl('templates/friends/friend-requests.html', {
          id: '2',
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal2 = modal;
        });
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

      $scope.showFriendRequests = function () {
        $scope.modal2.show();
      };
      $scope.model = {
        contacts : [],
        selectedContacts : [],
        telephone: ''
      };


//      <div class="card" ng-repeat="friendRequest in model.outstandingFriendRequests">
//        <div class="item">
//        <div class="request-{{friendRequest.color}}">
//        <span class="requestor-name">{{friendRequest.name}}</span>
//    <span class="friend-request-button">Accept</span>
//  <span ng-click="dismissRequest(friendRequest.id)">X</span>
//</div>
//</div>
//</div>



      $scope.openModal = function (index) {
        if(+index === 1) {
          $scope.modal1.show();
          $scope.findFriendsToAdd($scope.selectedMenuItem);
        }
        else {
          $scope.modal2.show();
        }
      };
      $scope.closeModal = function (index) {
        if (+index === 1) {
          $scope.modal1.hide();
        }
        else {
          $scope.modal2.hide();
        }
      };
      $scope.$on('$destroy', function () {
        $scope.modal1.remove();
        $scope.modal2.remove();
      });

      $scope.checkFriendRequests = function () {
        UserService.CheckFriendRequests().then(function (results){
          $scope.model.outstandingFriendRequests = results;
          $scope.model.outstandingFriendRequests.count = results.length;
        });

      };

      //var hashContactPhones = function (contacts) {
      //  var contactsWithHashedPhones = [];
      //  _.foreach(contacts, function (c) {
      //
      //  })
      //};

      $scope.findFriendsToAdd = function(color) {
        $scope.model.selectedMenuItem = color;
        ContactsService.GetContacts().then(function (contacts) {
          $scope.model.contacts = contacts;
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
