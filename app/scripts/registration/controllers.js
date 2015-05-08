'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$ionicLoading', '$state', function($scope, $ionicLoading, $state){
    $scope.model = {
        devices:[
            { name: 'Alice\'s Jewliebot Device'},
            { name: 'Bob\'s Jewliebot Device'}
        ]
    }; //STUB
    $scope.pairToDevice = function(name) {
        //STUB: Replace with pairing logic
        $state.transitionTo('registration-step-two', name);
    };
}])
.controller('RegistrationCtrl',['$scope','$ionicLoading', '$state', function($scope, $ionicLoading, $state){

}]);
