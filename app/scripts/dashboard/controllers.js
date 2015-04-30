'use strict';
angular.module('jewlieApp.controllers')
.controller('SignupCtrl', function($scope, $ionicLoading, $state, $stateParams, JewliebotService){
    if (!JewliebotService.IsPaired()) {
        $state.transitionTo('pair');
    }
    $scope.registrationModel = {};

})
.controller('LoginCtrl', ['$scope', '$ionicLoading', '$state', function($scope, $ionicLoading, $state) {
    $scope.onTouch = function() {
        console.log('logged In');
        $state.transitionTo('dashboard');
    };
}]);
