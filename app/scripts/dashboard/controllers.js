'use strict';
angular.module('jewelApp.controllers')
.controller('SignupCtrl', function($scope, $ionicLoading, $state, $stateParams, JewelbotService){
  if (!JewelbotService.IsPaired()) {
    $state.transitionTo('pair');
  }
  $scope.registrationModel = {};

})
.controller('HomeCtrl',['$scope', '$window', 'JewelbotService',  function($scope, $window, JewelbotService) {
  $scope.startUp = function() {
    $scope.appId = JewelbotService.GetAppId();
    if (!$scope.appId) {
      $scope.appId = $scope.generateAppId();
      JewelbotService.SetAppId($scope.appId);
    }
  };

  $scope.generateAppId = function(key, salt) {
    return (salt+key);
  };



}])
.controller('LoginCtrl', ['$scope', '$ionicLoading', '$state', function($scope, $ionicLoading, $state) {
    $scope.onTouch = function() {
      console.log('logged In');
      $state.transitionTo('dashboard');
    };
}]);
