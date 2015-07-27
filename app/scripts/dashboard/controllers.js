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
      $logService.Log('modal scope is: ' + JSON.stringify($scope.model));
    });
    $scope.hasFriends = function() {

      $logService.Log('message', 'entering has friends');
      return UserService.HasFriends();
    };
    $scope.model = {
      contacts : [],
      selectedContacts : []
    };
    var getPhoneNumbers = function (r) {
      var phoneNumbersArray = r.phoneNumbers;
      var phoneNumbers = _.pluck(phoneNumbersArray, 'value');
      return phoneNumbers;

    }
    var getFirstName = function (r) {
      if (r.name.givenName === null) return;
      return {
        givenName: r.name.givenName,
        familyName: ((typeof r.name.familyName === 'string' || r.name.familyName instanceof String) && r.name.familyName.length > 0) ? r.name.familyName.charAt(0) : '',
        phoneNumbers: getPhoneNumbers(r)

      };
    };
    $scope.openModal = function (color) {
      $scope.modal.show();
      $scope.findFriendsToAdd(color);
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $scope.findFriendsToAdd = function(color) {
      $scope.model.color = color;
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

    $scope.$watch('model.contacts', function(contacts){
      $scope.count = 0;
      angular.forEach(contacts, function(selectedContact){
        if(selectedContact.checked){
          $scope.model.count += 1;
        }
      })
    }, true);
}]);
