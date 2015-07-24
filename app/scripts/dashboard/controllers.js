'use strict';
angular.module('jewelApp.controllers')
.controller('HomeCtrl',['$scope', '$window', '$state', 'DataService',  function($scope, $window, $state, DataService) {
    $scope.isPaired = function() {
      if (!DataService.IsPaired()) {
        $state.go('pair');
      }
      else {
        $state.go('dashboard');
      }
    };

}])
.controller('DashboardCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaContacts', '$logService', 'UserService', '_', '$ionicModal', function($scope, $state, $ionicPlatform, $cordovaContacts, $logService, UserService, _, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/friends/add-friends.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.hasFriends = function() {

      $logService.Log('message', 'entering has friends');
      return UserService.HasFriends();
    };
    $scope.model = {
      contacts : []
    };
    var getFirstName = function (r) {
      return {
        givenName: r.name.givenName,
        familyName: ((typeof r.name.familyName === 'string' || r.name.familyName instanceof String) && r.name.familyName.length > 0) ? r.name.familyName.charAt(0) : ''

      };
    };
    $scope.openModal = function ($event) {
      $scope.modal.show($event);
      //$scope.findFriendsToAdd($event);
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $scope.findFriendsToAdd = function(color) {
      $logService.Log('message', 'entering find Friends?' + JSON.stringify(color));
        $ionicPlatform.ready().then( function () {
          return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers'], multiple:true}).then(function (success) {
            var contactsPicked = [];

              _.forEach(success, function (p) {
                $scope.model.contacts.push(getFirstName(p));
              });
              $logService.Log('message', 'success is : ' + JSON.stringify($scope.model.contacts));
          });
        });
    };
    $scope.addFriends = function() {
      $scope.modal.hide();
    }
}]);
