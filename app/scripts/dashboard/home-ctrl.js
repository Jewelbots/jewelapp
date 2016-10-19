'use strict';
angular.module('jewelApp.controllers')
  .controller('HomeCtrl',
  [
    '$scope',
    '$state',
    '$window',
    'DataService',
    function(
      $scope,
      $state,
      $window,
      DataService) {
      $scope.isPaired = function() {
        if (!DataService.IsPaired()) {
          $state.go('pair');
        }
        else {
          $state.go('dashboard');
        }
      };

}]);
