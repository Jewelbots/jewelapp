angular.module('jewlieApp.controllers')
.controller('DashboardCtrl', ['$scope', function($scope) {
    $scope.addFriends = function() {
        $state.transitionTo('addFriends');
    }
}])
.controller('FriendsCtrl', ['$scope', function($scope){

}]);