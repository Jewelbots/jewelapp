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
.controller('DashboardCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.addFriends = function() {
    $state.transitionTo('addFriends');
  };
}]);
