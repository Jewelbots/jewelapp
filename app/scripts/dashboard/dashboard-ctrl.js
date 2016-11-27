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
    '$q',
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
      $q,
      _
    )
     {
      $scope.startUp = function () {

        if ($stateParams.src === 'phoneVerification') {
          $cordovaDialogs.alert('', 'Your phone number has been verified', 'OK');
          delete $stateParams.src;
        }
        $scope.model.phoneNumber = UserService.GetPhoneNumber();
        /* NOTE: SCR: These things are commented out because the functionality
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
        // $scope.getFirmwareRevision();
      };

      /* TODO: NOTE: SCR
       * this function is not in use but something like this might be appropriate
       * for a reconnect scenario as described in $scope.getFirmwareRevision
       * but because of the problems described there, this is useless
       */
      $scope.checkConnection = function(deviceId) {
        return $cordovaBluetoothle.isConnected({address: deviceId})
        .then(function(response) {
          // response.isConnected will be true or false
          // IF the thing was EVER connected, but not if it was NEVER
          // so theoretically, if true, move on bc connected and if false, reconnect()
          return $q.when(response)
        })
        .catch(function(err) {
          // if we've never connected (in this session)
          // then instead of being FALSE like a NORMAL API
          // it throws and damn exception????????? so if the exception
          // happens then if it's 'neverConnected', you do regular connect()
          if(err.error === "neverConnected") {
            return $q.when({isConnected: "neverConnected"})
          } else {
            // if it's not neverConnected, then, idk, shrug emoji?
            return $q.reject(err)
          }
        })
      };

      $scope.getFirmwareRevision = function () {
        var deviceId = DataService.GetDeviceId();
        var params = {address: deviceId}
        var result = $cordovaBluetoothle.initialize({'request': true})
        .then(function(data) {
          //TODO: handle status disabled

          /* TODO: ISSUE
           * so if you get disconnected, you should reconnect, and in fact, if you call
           * connect() under a circumstance where you were previously connected (but no longer are), you will
           * *probably* (though not always reliably) get an error
           * Okay. You would theoretically use something like the $scope.checkConnection()
           * method above to make a decision about connecting or reconnecting, except
           * that actually calling reconnect() doesn't seem to work in practice and is
           * discouraged by the cordova bluetoothle library maintainer
           * see: https://github.com/randdusing/cordova-plugin-bluetoothle#connect
           * and: https://github.com/randdusing/cordova-plugin-bluetoothle/issues/381#issuecomment-261149151
           *
           * Okay, so given that, one solution is to just connect fresh every time, so
           * theoretically you would call these two functions before each attempt
           * $cordovaBluetoothle.disconnect(params)
           * $cordovaBluetoothle.close(params)
           * and of course that doesn't seem to work as expected either, potentially because
           * there are issues with close() and ios10 according to the GH issues.
           * so, currently, this works, but only in a situation where you open the app fresh.
           * calling connect() when already connected doesn't *appear* to have adverse effects.
           *
           * another option might be having a catch-all sitch in the catch() block that
           * will hard disconnect/close the session and offer a button to try again, similar to
           * what happens in pair-ctrl.js
           */
          return $timeout($cordovaBluetoothle.connect(params))
        })
        .then(function(response) {
          // discover device services and characteristics. Must do this before read.
          // discover() doesn't work great on ios but would on android. on ios
          // you have to walk through services() to get to characteristics() or you'll error
          return $cordovaBluetoothle.services({address: deviceId})
        })
        .then(function(response) {
          // getting characteristics for service 180A, even though we know what one we want
          // and in a good API could go straight to the read() below shrug emoji gun emoji
          return $cordovaBluetoothle.characteristics({address: deviceId, service: "180A"});
        })
        .then(function(response) {
          // TODO: Service 180A characteristic 2A26 = Firmware Revision
          // currently broadcasting as #CURRENT_TAG#
          // which appears to come from https://github.com/Jewelbots/jewelbot-firmware/blob/master/src/rev.h#L3
          // so this will need to be updated to actually function as a way to check
          // firmware version. But when the bot can do that, this will get the firmware ver.
          return $cordovaBluetoothle.read({address: DataService.GetDeviceId(), service: "180A", characteristic: "2A26"})
        })
        .then(function(response) {
          var versionBytes = $cordovaBluetoothle.encodedStringToBytes(response.value);
          var version = $cordovaBluetoothle.bytesToString(versionBytes);
          // TODO: when this is workable, check against server version
          // to kick off DFU process as necessary
          // it also makes sense to check against a minimum firmware version
          // before app DFU is implemented to warn them to upgrade
          // but this can't be done until 2a26 broadcasts appropriately
          // so obviously this would need to be updated to not hardcode a ver #

          version = 0;
          $scope.model.message += version;
          if(DataService.FirmwareUpdateRequired(version)) {
            $scope.model.updateRequired = "You need to update!";
          } else {
            $scope.model.updateRequired = "No updates required!";
          }
        })
        .catch(function(err) {
          $logService.Log('error', 'failed getFirmwareRevision: ' + JSON.stringify(err));
          $scope.model.message += " Error getting Firmware Version: " + JSON.stringify(err);
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
