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
      console.log('user has not paired device');
      $state.transitionTo('demo.control');
    }
    else {
      console.log('paired-> to dashboard!');
      $state.transitionTo('dashboard');
    }

  }]);
