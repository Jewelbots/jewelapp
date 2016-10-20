'use strict';
angular.module('jewelApp.controllers')
  .controller('StartCtrl', [
  '$scope',
  '$state',
  'JewelbotService',
  function (
   $scope,
   $state,
   JewelbotService) {

    if (!JewelbotService.IsPaired()) {
      $logService.Log('message', 'User has Not Paired Device');
      $state.transitionTo('home');
    }
    else {
      $logService.Log('message', 'paired-> to dashboard!');
      $state.transitionTo('dashboard');
    }

  }]);
