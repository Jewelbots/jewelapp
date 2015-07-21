'use strict';
angular.module('jewelApp.controllers')
.controller('HomeCtrl',['$scope', '$window', '$state', 'DataService',  function($scope, $window, $state, DataService) {
    $scope.isPaired = function() {
      if (!DataService.IsPaired()) {
        $state.go('pair');
      }
      else {
        $state.go('dashboard');
      }
    };
  $scope.startUp = function() {
    $scope.appId = JewelbotService.GetAppId();
    if (!$scope.appId) {
      $scope.appId = $scope.generateAppId();
      JewelbotService.SetAppId($scope.appId);
    }
  };

  $scope.generateAppId = function(key, salt) {
    if (!key || !salt) {
      return undefined;
    }
    return (salt.toString()+ key.toString());
  };

}])
.controller('DashboardCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaContacts', '$logService', 'UserService', function($scope, $state, $ionicPlatform, $cordovaContacts, $logService, UserService) {
    $scope.hasFriends = function() {
      $logService.Log('message', 'entering has friends');
      return UserService.HasFriends();
    }
    $scope.contacts = [];
    $scope.findFriendsToAdd = function(color) {
      try {
        $logService.Log('message', 'entering find Friends?');
        $ionicPlatform.ready().then(function () {
          $logService.Log('message', 'entering we are ready in ionicPlatform');
          $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers']}).then(function (contactPicked) {
            $logService.Log('message', 'contact picked: ' + JSON.stringify(contactPicked));
          });
        });
      }
      catch (err) {
        $logService.Log('error', err);
      }
    };

}]);
