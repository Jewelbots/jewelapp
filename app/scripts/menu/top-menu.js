/* global document */
'use strict';
angular.module('jewelApp.directives')
  .directive('jewelbotsTopMenu', ['_', function(_) {
  return {
    restrict: 'E',
    templateUrl: 'templates/menu/top-menu.html',
    scope : false,
    link: function (scope, element, attrs) {
      scope.toggleTopMenu = function () {
          var menu = document.getElementsByTagName('ion-top-menu')[0];
          var pane = document.getElementsByTagName('ion-pane')[0];
          menu.style.height = pane.style.top = (menu.offsetHeight==0)?'300px':'0px';
      };
    }
  };
  }]);
