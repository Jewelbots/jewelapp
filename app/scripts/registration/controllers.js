'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', 'JewelbotService', function($scope, $state, JewelbotService){
    //$scope.model = {
    //    devices:[
    //        { name: 'Alice\'s Jewelbot' address: 'BAB012AC-21BA-FDB8-1121-B2482B1F4A61'},
    //        { name: 'Bob\'s Jewelbot', address: 'ECC037FD-72AE-AFC5-9213-CA785B3B5C63'}
    //    ]
    //}; //STUB
    $scope.model = {
      status : [],
      devices : []
    };
    $scope.pairToDevice = function(device) {
        var paired = JewelbotService.Pair(device);
        if (paired.result === 'success') {
          $state.transitionTo('registration-step-two', device.name);
        }
    };
    $scope.getAvailableDevices = function() {
      $scope.model.status.push('Getting devices');
      var devices = JewelbotService.GetDevices();
      $scope.model.status.push('got devices');
      $scope.model.status.push(devices);
      for (var property in devices) {
        $scope.model.devices.push({name: devices[property]});
      }
    };
}])
.controller('RegistrationCtrl', function(){

});
