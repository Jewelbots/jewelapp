'use strict';
angular.module('jewelApp.controllers')
.controller('LoadCtrl', [
  '$ionicLoading',
  '$scope',
  '$state',
  '$timeout',
  function(
    $ionicLoading,
    $scope,
    $state,
    $timeout
  ) {
    $scope.show = function() {
      $ionicLoading.show({
        templateUrl: '/templates/start/load.html'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
      $state.transitionTo('start');
    };
    $timeout($scope.show, 5000).then(function() {
      $scope.hide();
    });

  }]);
