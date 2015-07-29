angular.module('jewelbotsMenuDirective', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.selectedMenuItem = '';
  }])
  .directive('menuDirective', function() {
    return {
      template: '<ul id="colorbar2">' +
    '<li class="circle red" onclick="addremoveclassfunction(this)">╳</li>' +
    '<li class="circle blue" onclick="addremoveclassfunction(this)">╳</li>' +
    '<li class="circle green" onclick="addremoveclassfunction(this)">╳</li>' +
    '<li class="circle yellow" onclick="addremoveclassfunction(this)">╳</li>' +
    '<li class="circle purple" onclick="addremoveclassfunction(this)">╳</li>' +
    '</ul>'
    };
  });
