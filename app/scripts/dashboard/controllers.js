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
.controller('DashboardCtrl', ['$scope', '$state', '$ionicPlatform', '$cordovaContacts', '$logService', 'UserService', '_', function($scope, $state, $ionicPlatform, $cordovaContacts, $logService, UserService, _) {

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
    $scope.findFriendsToAdd = function(color) {
      $logService.Log('message', 'entering find Friends?' + JSON.stringify(color));
        $ionicPlatform.ready().then( function () {
          return $cordovaContacts.find({fields: ['givenName', 'familyName', 'phoneNumbers'], multiple:true}).then(function (success) {
            var contactsPicked = [];
            try {
              _.forEach(success, function (p) {
                $scope.model.contacts.push(getFirstName(p));
              });
              $logService.Log('message', 'success is : ' + JSON.stringify($scope.model.contacts));
            }

            catch (err) {
              $logService.Log('message', 'error in find contacts? : ' + err.name);
              $logService.Log('message', 'error in find contacts? : ' + err.message);
              $logService.Log('message', 'error in find contacts? : ' + err.stack);
            }

            $logService.Log('message', 'exiting; we made it here.' + JSON.stringify($scope));
          });
        });
    };
}]);
