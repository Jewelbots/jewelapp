'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', 'JewelbotService', function($scope, $state, JewelbotService){
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
    $scope.availableDevices = function() {
      return JewelbotService.GetDevices();
    };
}])
.controller('RegistrationCtrl', function(){

});
