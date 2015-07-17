'use strict';
angular.module('jewelApp.controllers')

.controller('FriendsCtrl', ['$scope','$logService', '$cordovaContacts', $ionicPlatform, function($scope, $logService, $cordovaContacts, $ionicPlatform){
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
