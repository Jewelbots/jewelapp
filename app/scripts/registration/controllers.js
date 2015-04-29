angular.module('jewlieApp.controllers')
.controller('PairCtrl', function($scope, $ionicLoading, $state, $stateParams){
    var isIOS = function() {
        return (ionic.Platform.isIPad() || ionic.Platform.isIOS());
    };

    $scope.model = {
        devices:[
            { name: "Alice''s Jewliebot Device"},
            { name: "Bob's Jewliebot Device"}
        ]
    } //STUB
    $scope.pairToDevice = function(name) {
        //STUB: Replace with pairing logic
        $state.transitionTo('registration-step-two');
    }
})
.controller('RegistrationCtrl', function($scope, $ionicLoading, $state, $stateParams){
    ionic.Platform.ready(function(){
        var deviceInformation = ionic.Platform.device();
    });
    var confirmCallback = function(buttonIndex) {
        switch(buttonIndex) {
            case 1:
                //send SMS
                console.log("send SMS presssed");
                break;
            case 2:
                console.log('Call Me Instead pressed');
                break;
            case 3:
                console.log('Cancel Pressed');
                break;
        }
    }
    $scope.validateLoginCredentials = function() {
        $state.transitionTo('registration-step-four');
    }
    $scope.sendParentEmail = function() {
        $state.transitionTo('dashboard');
    }
    $scope.verifyNumber = function() {
        var message = "We will send a verification code to " + $scope.phoneNumber + "\n To complete your phone number, enter the 6-digit verification code. ";

        if (ionic.Platform.isIOS()) {
            navigator.notification.confirm(message, confirmCallback, 'VerificationCode', ['Send via SMS', 'Call me instead', 'Cancel'] );
        }
        $state.transitionTo('registration-step-three');
    }
    $scope.noPhoneNumber = function() {
        $state.transitionTo('registration-step-three');
    }
});