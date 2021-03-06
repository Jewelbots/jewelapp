'use strict';
angular.module('jewelApp.controllers')
  .controller('FriendsCtrl', [
    '$logService',
    '$scope',
    '$state',
    '$timeout',
    '$cordovaBluetoothle',
    '$ionicModal',
    'DataService',
    'UserService',
    'JewelbotService',
    '_',
    function(
      $logService,
      $scope,
      $state,
      $timeout,
      $cordovaBluetoothle,
      $ionicModal,
      DataService,
      UserService,
      DeviceService,
      JewelbotService,
      _
    ){
      $scope.model = {
        message: 'Friends!',
        localFriends: DataService.GetFriends(),
        deviceFriends: [],
        friends: [],
        test_text : ''
      };

      $scope.startup = function(){
        $logService.Log('Made it into startup');
        $scope.ReadFriends();
      };
      //TODO this should be in a central place, not sure where that is right now


      // TODO: this should go into a service layer
      // TODO: this should go into a service layer
   $scope.ReadFriends = function() {
     $logService.Log('Made it into read friends');

     var deviceId = DataService.GetDeviceId();
     var friendsService = "63400001-1A1E-5704-0A53-844BD14254A1"; //device service address for friends list
     var friendsWriteChar = "63400003-1A1E-5704-0A53-844BD14254A1"; //characteristic address for writing friends list
     var friendsReadChar = "63400002-1A1E-5704-0A53-844BD14254A1"; //characteristic address for reading friends list

     var result = $cordovaBluetoothle.initialize({'request': true})
     .then(function (response) {
       return $timeout($cordovaBluetoothle.connect({address: deviceId}))
     })
     .then(function(response) {
       return $cordovaBluetoothle.services({address: deviceId})
     })
     .then(function(response) {
       return $cordovaBluetoothle.characteristics({address: deviceId, service: friendsService})
     })
     .then(function(response) {
       return $cordovaBluetoothle.read({address: deviceId, service: friendsService, characteristic: friendsReadChar})
     })
     .then(function(response) {
       var rawFriendsList = $cordovaBluetoothle.encodedStringToBytes(response.value);
       $cordovaBluetoothle.disconnect({address: deviceId});
       if(rawFriendsList[0] === 0) {
         $logService.Log('no friends :');

         // if first byte is 0 then friends list is empty
         $scope.model.friends = [];
       } else {
         $scope.model.deviceFriends = $scope.parseFriends([].slice.call(rawFriendsList));
         $scope.model.friends = $scope.model.deviceFriends;
       }
     })
     .catch(function(err) {
       $logService.Log('error', 'failed ReadFriends: ' + JSON.stringify(err));
       $scope.model.message += "Error: " + JSON.stringify(err);
     });
     return true;
   };

      /* friends will come from device as a flattened uint8array
       * each "friend" is 8 bytes of the array, up to I think 16 friends
       * [friend index 0, device address (reversed) 1-6, color 7]
       * so [1,97,134,83,125,97,221,2] is:
       * friend.index = 1 (first friend always 1, should never be 0, so 0 here means empty)
       * friend.address = 221:97:125:83:134:97 (reversed from how stored on device)
       * friend.color = 2 (blue)
       * color codes:
       *   0 = red, 1 = green, 2 = blue, 3 = cyan (will be more later)
       */
      $scope.parseFriends = function(raw) {
        //var colors = ["red", "green", "blue", "cyan"];
        $logService.Log('we are on for parse friends');
        var packed = [];
        var red = 0, green = 0, blue = 0, cyan = 0;
        while (raw.length > 0) {
          packed.push(raw.splice(0, 8));
        }
        var friends = [];
        for(var i=0; i<packed.length; i++) {
          var friend = packed[i];

          // a valid friend should never have a 0 as the first element
          if(friend[0] !== 0) {
            //in order to return a detailed friends list return the array built below. We are switching to the below for iteration one of the app
            //friends.push({index: i, address: friend.slice(1,7).reverse().join(':'), color: colors[friend[7]], name: "Friend " + friend[0]});
            //TODO: lookup friend name from db if available otherwise Edit Name
            switch(friend[7]){
            case 0:
              red++;
              break;
            case 1:
              green++;
              break;
            case 2:
              blue++;
              break;
             case 3:
              cyan++
              break;
            default:
              $logService.Log('we are in the default of the switch statement');
              break;
            }
          }
        }
        var color_count = [red, green, blue, cyan];

        //TODO: possibly should compare friends from device and friends from db
        //and update local db based on device, if device is canonical
        //doesn't need to be implemented until there are future friends list
        //would need to handle for a "name" that can be stored on the db but not
        //on the device, so can't be a straight compare. In here would call
        //DataService.SetFriends(friends) and probably abstract the names thing to the DataService?
        $logService.Log('message', 'info count: ' + color_count);

        return color_count;
      };

      $scope.packageFriends = function(friends) {
        //re-reverse address and remove any delimiters
        //store appropriate color index number
        //package as flattened uint8array
      };

      $scope.startup();



      $scope.disconnectBLE = function(){
        var deviceId = DataService.GetDeviceId();
        $logService.Log('we are out' + deviceId);
        var disconnect = $cordovaBluetoothle.close({address: deviceId});
        $state.go('friendship_instruction');
      };


    }]);
