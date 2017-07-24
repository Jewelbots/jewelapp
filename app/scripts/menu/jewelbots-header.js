  'use strict';
  angular.module('jewelApp.controllers')
  .controller('HeaderCtrl',['$scope', '$state',  function ($scope, $state) {
    $scope.$on('$ionicView.enter', function(e) {
      $timeout(function() {
        showHeader();
      }, 1000);

      function showHeader() {
        // Having the nav-bar in your template, set an ID to it.
  var header = document.getElementById("jewelbots_header");
  if (header.classList) {
  if (header.classList.contains('hide')) {
    header.classList.remove('hide');
  }
  }
}})

  }]);
    
