'use strict';
angular.module('jewelApp.controllers')
.controller('DashboardCtrl',
  [
    '$cordovaDialogs',
    '$ionicModal',
    'ionicReady',
    '$logService',
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    '$cordovaBluetoothle',
    'ContactsService',
    'UserService',
    'DataService',
    '_',
    function(
      $cordovaDialogs,
      $ionicModal,
      ionicReady,
      $logService,
      $scope,
      $state,
      $stateParams,
      $timeout,
      $cordovaBluetoothle,
      ContactsService,
      UserService,
      DataService,
      _
    )
     {
      $scope.startUp = function () {

        if ($stateParams.src === 'phoneVerification') {
          $cordovaDialogs.alert('', 'Your phone number has been verified', 'OK');
          delete $stateParams.src;
        }
        $scope.model.phoneNumber = UserService.GetPhoneNumber();
        /* SCR: These things are commented out because the functionality
         * may or may not have worked, but definitely doesn't currently
         */

        //$ionicModal.fromTemplateUrl('templates/friends/add-friends.html', {
          //id: '1',
          //scope: $scope,
          //animation: 'slide-in-up'
        //}).then(function (modal) {
          //$scope.modal1 = modal;
        //});
        //$scope.checkFriendRequests();
        //$ionicModal.fromTemplateUrl('templates/friends/friend-requests.html', {
          //id: '2',
          //scope: $scope,
          //animation: 'slide-in-up'
        //}).then(function (modal) {
          //$scope.modal2 = modal;
        //});
        //$scope.getFriends();

        // TODO: for DFU feature, this might be a good place to check firmware version
        // and kick that process off. The function to check is provided and documented
        $scope.getFirmwareRevision();
      };

      $scope.getFirmwareRevision = function () {
        var result = $cordovaBluetoothle.initialize({'request': true})
        .then(function (response) {
          return $timeout($cordovaBluetoothle.connect({address: DataService.GetDeviceId()}))
        })
        .then(function(response) {
          // discover device services and characteristics. Must do this before read.
          return $cordovaBluetoothle.discover({address: DataService.GetDeviceId()})
        })
        .then(function(response) {
          // Service 180A characteristic 2A26 = Firmware Revision
          // currently broadcasting as #CURRENT_TAG#
          // which appears to come from https://github.com/Jewelbots/jewelbot-firmware/blob/master/src/rev.h#L3
          // so this will need to be updated to actually function
          return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "180A", characteristic: "2A26"})
        })
        .then(function(response) {
          var versionBytes = $cordovaBluetoothle.encodedStringToBytes(response.value);
          var version = $cordovaBluetoothle.bytesToString(versionBytes);
          //here it would make sense to store current version
          //DataService.SetFirmwareVersion()
          //and then check against server version
          //DataService.GetLatestFirmwareVersion()
          //to kick off DFU process as necessary
          // it also makes sense to check against a minimum firmware version
          // before app DFU is implemented to warn them to upgrade
          // but this can't be done until 2a26 broadcasts appropriately

          // obviously this would need to be updated to drive things
          $scope.model.message = version;
          $scope.model.updateRequired = "No updates required!";
        })
        .catch(function(err) {
          $logService.Log('error', 'failed getFirmwareRevision: ' + JSON.stringify(err));
          $scope.model.message += "Error getting Firmware Version: " + JSON.stringify(err);
        });
        return true;
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

      $scope.getFriends = function () {
        $scope.model.friends = UserService.GetFriends();
      };

      $scope.showFriendRequests = function () {
        $scope.modal2.show();
      };
      $scope.model = {
        contacts : [],
        selectedContacts : [],
        telephone: ''
      };
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
        });
      };

      $scope.acceptFriendRequest = function (friendRequest) {
        UserService.AcceptFriendRequest(friendRequest).then (function (result) {
          _.remove($scope.model.outstandingFriendRequests, friendRequest);
          $scope.getFriends();
          if ($scope.model.outstandingFriendRequests.length === 0) {
            $scope.closeModal(2);
          }
          $logService.Log(JSON.stringify(result));
        }, function (error) {
          $logService.Log('error', 'unable to accept friend request: ' + JSON.stringify(error));
        });
      };

      $scope.dismissRequest = function (friendRequest) {
        UserService.RejectFriendRequest(friendRequest).then (function (result) {
          console.log(result);
          _.remove($scope.model.outstandingFriendRequests, friendRequest);
          if ($scope.model.outstandingFriendRequests.length === 0) {
            $scope.closeModal(2);
          }
        }, function (error) {
          $logService.Log('error', 'unable to clear friend request: ' + JSON.stringify(error));
        });
      };

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
          $scope.closeModal(1);
        }, function (error) {
          $logService.Log('error', 'could not add friends: ' + JSON.stringify(error));
        });

      };

      $scope.sendSMS = function (telephone) {
        $logService.Log('sending SMS to number: ' + JSON.stringify(telephone));
        $state.go('sms-verification-screen', { telephone: telephone});
      };

      $scope.startUp();
    }]);
