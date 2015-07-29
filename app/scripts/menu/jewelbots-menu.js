angular.module('jewelApp.directives')
  .directive('jewelbotsMenu', function() {
    return {
      restrict: 'E',
      scope : {
        selectedMenuItem : '='
      },
      controller : function ($scope, $element) {
        console.log('element is: ' + $element);
        $scope.addRemoveClassFunction = function (color) {
          console.log('clicked!');
          var a = angular.element(document.getElementsByTagName('li')),
            i = 0;
          // loop through all 'a' elements
          for (i = 0; i < a.length; i++) {
            // Remove the class 'active' if it exists
            a[i].classList.remove('activated');
            a[i].classList.remove('active');
          }
          // add 'active' classs to the element that was clicked
          var elements = angular.element(document.getElementsByClassName(color));
          for (var j = 0; j < elements.length; j = j + 1) {
            elements[j].classList.add('activated');
            elements[j].classList.add('active');
          }
          $scope.selectedMenuItem = color;
        };
      },
      template: '<ul id="jewelbots-menu-bar">' +
    '<li class="circle red" ng-click="addRemoveClassFunction(\'red\')">╳</li>' +
    '<li class="circle blue" ng-click="addRemoveClassFunction(\'blue\')">╳</li>' +
    '<li class="circle green" ng-click="addRemoveClassFunction(\'green\')">╳</li>' +
    '<li class="circle yellow" ng-click="addRemoveClassFunction(\'yellow\')">╳</li>' +
    '<li class="circle purple" ng-click="addRemoveClassFunction(\'purple\')">╳</li>' +
    '</ul>'
    };
  });
