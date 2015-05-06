'use strict';
angular.module('jewelApp.controllers')
.controller('SignupCtrl'['$scope', '$ionicLoading', '$state', '$stateParams', 'JewelbotService', function($scope, $ionicLoading, $state, $stateParams, JewelbotService){

  $scope.registrationModel = {};

}])
.controller('HomeCtrl',['$scope', '$window', '$state', 'JewelbotService',  function($scope, $window, $state, JewelbotService) {
    $scope.isPaired = function() {
      if (!JewelbotService.IsPaired()) {
        $state.transitionTo('pair');
      }
    }
    //$scope.isPaired();
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
.controller('LoginCtrl', ['$scope', '$ionicLoading', '$state', function($scope, $ionicLoading, $state) {
    $scope.onTouch = function() {
      console.log('logged In');
      $state.transitionTo('dashboard');
    };
}]);
