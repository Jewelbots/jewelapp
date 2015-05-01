'use strict';
angular.module('jewelApp.controllers')
.controller('DashboardCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.addFriends = function() {
        $state.transitionTo('addFriends');
    };
}])
.controller('FriendsCtrl', ['$scope', function($scope){
  $scope.consoleLog = 'hi';
}]);
