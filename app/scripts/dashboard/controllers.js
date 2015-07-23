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

}])
.controller('DashboardCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaContacts', '$logService', 'UserService', '_', function($scope, $state, $ionicPlatform, $cordovaContacts, $logService, UserService, _) {
    $scope.hasFriends = function() {
      $logService.Log('message', 'entering has friends');
      return UserService.HasFriends();
    };
    $scope.model = {
      contacts : []
    };
    $scope.findFriendsToAdd = function(color) {
      $logService.Log('message', 'entering find Friends?' + JSON.stringify(color));
      return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers']}).then(function (success) {
        try {
          $logService.Log('message', '$cordovaContacts success! ');
          $scope.model.contacts = _.map(success, function (p) {
            return {
              givenName: p.givenName,
              familyName: p.familyName.charAt(0)
            };
          }, 'id');
        }
        catch (err) {
          $logService.Log('message', 'error in find contacts? : ' + JSON.stringify(err));
        }
        $logService.Log('message', 'exiting; we made it here.' + JSON.stringify($scope));
      });
    };
}]);
