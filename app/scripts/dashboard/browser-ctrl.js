'use strict';

angular.module('jewelApp.controllers')
  .controller('BrowserCtrl',
  [
    '$scope',
    '$state',
    '$window',
    '$logService',
    'DataService',
    '$cordovaInAppBrowser',
    function(
      $scope,
      $state,
      $window,
      $logService,
      DataService,
      $cordovaInAppBrowser) {
        $scope.model = {
          status : "starting..."
        };

      $scope.$on("$ionicView.enter", function() {
        var browser_buttons = document.querySelectorAll('.browser');
        for (var i = 0; i < browser_buttons.length; i++) {
            browser_buttons[i].addEventListener('click', function(event) {
                var location = this.id;
                var win = $cordovaInAppBrowser.open('http://jewelbots.com/pages/' + location, '_blank')
                .then(function(event) {

                })
                .catch(function(event) {
                });
        })}
      });
    $scope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
    // insert CSS via code / file
    $cordovaInAppBrowser.insertCSS({
      code: '.back-mobile {display : none}'
    });

    // insert Javascript via code / file
    $cordovaInAppBrowser.executeScript({
      code: "document.getElementsByClassName('back-mobile')[0].style.visibility = 'hidden';"
    });
      });
    $scope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
    // insert CSS via code / file
    $cordovaInAppBrowser.insertCSS({
      code: '.back-mobile {display : none}'
    });

    // insert Javascript via code / file
    $cordovaInAppBrowser.executeScript({
      code: "document.getElementsByClassName('back-mobile')[0].style.visibility = 'hidden';"
    });
  });
}]);
