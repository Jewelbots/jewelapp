'use strict';
angular.module('jewelApp.controllers')
  .controller('HomeCtrl',
  [
    '$scope',
    '$state',
    '$window',
    '$logService',
    'DataService',
    function(
      $scope,
      $state,
      $window,
      $logService,
      DataService) {
        $scope.model = {
          status : "starting..."
        };

      $scope.isPaired = function() {
        $logService.Log('You made it here');

        try{
        if (DataService.IsPaired() && $scope.NeedsFirmwareUpdate()){
           $logService.Log('its happening here, needs update');
            $state.go('needs-update');
          }
          else if(DataService.IsPaired()) {
            $logService.Log('its happening here, friends list');
            $state.go('friends-list');
         }
        }
        catch(err)
        {
          $logService.Log('Error While Loading: ' + JSON.stringify(err));
          $scope.model.status = 'Error While Loading: ' + JSON.stringify(err);
        }
      };
      $scope.goToPairing = function() {
        try{
          $state.go('pair');
        }
      catch(err)
      {
        $scope.model.status = 'Error While Loading: ' + JSON.stringify(err);
      }
    };

      $scope.isPaired();
}]);
