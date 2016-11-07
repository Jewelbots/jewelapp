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
        if (DataService.IsPaired()) {
          $state.go('dashboard');
        }
      };
      $scope.goToPairing = function() {
        $state.go('pair');
      }
      $scope.isPaired();
}]);
