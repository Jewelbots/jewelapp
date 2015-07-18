'use strict';
angular.module('jewelApp.controllers')
.controller('HomeCtrl',['$scope', '$window', '$state', 'JewelbotService',  function($scope, $window, $state, JewelbotService) {
    $scope.isPaired = function() {
      if (!JewelbotService.IsPaired()) {
        $state.transitionTo('pair');
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
      return UserService.HasFriends();
    }

    $scope.findFriendsToAdd = function() {
      $logService.Log('message', 'entering findFriendsToAdd');
      $ionicPlatform.ready().then(function () {
        $logService.Log('message', 'entering we are ready in ionicPlatform');
        $cordovaContacts.pickContact().then (function (contactPicked) {
          $logService.Log('message', 'contact picked: ' + JSON.stringify(contactPicked));
        });
      });
    };
}]);
