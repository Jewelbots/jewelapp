'use strict';
angular.module('jewelApp.controllers')
  .controller('StartCtrl', [
  '$scope',
  '$state',
  'JewelbotService',
  function (
   $logService,
   $scope,
   $state,
   JewelbotService, DataService) {


       $scope.startUp = function () {
         if (!JewelbotService.IsPaired()) {
           $logService.Log('message', 'User has Not Paired Device');
           $state.transitionTo('home');
         }
         else {
           $logService.Log('message', 'paired-> to friends-list!');
           $state.transitionTo('friends-list');
         } 
       }
       scope.startUp();
  }]);
