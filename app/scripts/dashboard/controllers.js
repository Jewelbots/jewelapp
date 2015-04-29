angular.module('jewlieApp.controllers')
.controller('SignupCtrl', function($scope, $ionicLoading, $state, $stateParams, JewliebotService){
    if (!JewliebotService.IsPaired()) {
        $state.transitionTo('pair');
    }
    $scope.registrationModel = {};

})
.controller('HomeCtrl',['$scope', function($scope) {
}])

.controller('LoginCtrl', function($scope, $ionicLoading, $state, $stateParams) {
    $scope.onTouch = function(item, event) {
        console.log("logged In");
        $state.transitionTo('dashboard');
    };
});
