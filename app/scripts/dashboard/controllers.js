'use strict';
angular.module('jewelApp.controllers')
.controller('SignupCtrl', function($scope, $ionicLoading, $state, $stateParams, JewliebotService){
  if (!JewliebotService.IsPaired()) {
    $state.transitionTo('pair');
  }
  $scope.registrationModel = {};

})
.controller('HomeCtrl',['$scope', 'JewelbotService', function($scope, JewelbotService) {
  $scope.startUp = function() {
    var deviceId = JewelbotService.GetDeviceId();
    if (!deviceId) {
      $scope.generateDeviceId();
      JewelbotService.SetDeviceId();
    }
  };

  $scope.generateDeviceId = function() {
    return 0;
  };



}])
.controller('LoginCtrl', ['$scope', '$ionicLoading', '$state', function($scope, $ionicLoading, $state) {
    $scope.onTouch = function() {
      console.log('logged In');
      $state.transitionTo('dashboard');
    };
}]);
