'use strict';

angular.module('jewelApp.controllers')
  .controller('StartupCtrl',
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

      $scope.$on("$ionicView.loaded", function() {

        document.getElementById("setup").onclick = function(){
              console.log("in setup");
              window.open('https://jewelbots.com/instructions', '_blank');
          }

    });
}]);
