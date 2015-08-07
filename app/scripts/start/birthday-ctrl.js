'use strict';
angular.module('jewelApp.controllers')
.controller('BirthdayCtrl',['$scope', '$state', 'UserService',  function ($scope, $state, UserService) {
  console.log('entered birthday controller');
  var birthdayAdded = function() {
    UserService.SetBirthday($scope.model.birthday);
    //if (false === true) { //userisunder13-stub
    //  $state.go('parental-consent');
    //}
    $state.go('privacy');
  };

  $scope.setBirthday = function() {
    UserService.SetBirthday($scope.model.birthday);
    birthdayAdded();
  };
  var model = {
    birthday: ''
  };
  $scope.model = model;


}]);
