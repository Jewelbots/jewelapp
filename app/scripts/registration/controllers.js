'use strict';
angular.module('jewelApp.controllers')
.controller('PairCtrl',['$scope', '$state', '$timeout', '$logService', '$ionicPlatform', '$cordovaBluetoothle', function($scope, $state, $timeout, $logService, $ionicPlatform, $cordovaBluetoothle){
    //$scope.model = {
    //};
    $scope.services = [];
    $scope.model = {
      status : [],
      devices : [],
      errors : [],
      messages : []
    };
    $scope.getErrors = function() {
      $timeout(function() {
        $scope.model.errors = $logService.GetErrors();
      });
    };
    $scope.getMessages = function () {
      $timeout(function() {
        $scope.model.messages = $logService.GetMessages();
      });
    };
    $scope.pairToDevice = function() {
        //var paired = JewelbotService.Pair(device);
        //if ('success') {
        //  $state.transitionTo('pair-success', device.name);
        //}
        //else {
        //  $scope.model.status.push('didn\'t succeed' + paired);
        //}
    };
    var contains = function (arr, str) {
      var len = arr.length;
      var i;
      for (i = 0; i < len; i = i + 1) {
        if (arr[i] === str) {
          return true;
        }
      }
      return false;
    };
    $scope.getAvailableDevices = function () {
      var addresses = [];

        $ionicPlatform.ready()
          .then(function () {
            var params = {request: true};
            return $cordovaBluetoothle.initialize(params)
              .then(function (initialized) {
                $logService.LogMessage('Initialized! : ' + JSON.stringify(initialized));
                return $cordovaBluetoothle.startScan(params);
              },
              function (err) {
                $logService.LogError('not initalized?: ' + JSON.stringify(err));
                if (err.hasOwnProperty('isInitialized') && !err.isInitialized) {
                  return $cordovaBluetoothle.initialize()
                    .then(function (initialized) {
                      var params = {request: true};
                      $logService.LogMessage('Initialized! : ' + JSON.stringify(initialized));
                      return $cordovaBluetoothle.startScan(params);
                    })
                    .then(function (data) {
                      $logService.LogMessage('data is: ' + JSON.stringify(data));
                      if (data.status === 'scanResult' && !(contains(addresses, data.address))) {
                        $logService.LogMessage('pushing new data: 2' + JSON.stringify(data));
                        $scope.model.devices.push(data);
                        return $cordovaBluetoothle.isScanning();
                      }
                      else {
                        $logService.LogMessage('stopping scan');
                        return $cordovaBluetoothle.isScanning();
                      }
                    }, function (error) {
                      $logService.LogError(error, 'Error while scanning:');
                    }, function (notify) {
                      $logService.LogMessage('still scanning: ' + JSON.stringify(notify));
                    }).then(function (scanning) {
                      $logService.LogMessage('result of scanning then is: ' + JSON.stringify(scanning));
                      if (scanning) {
                        return $cordovaBluetoothle.stopScan();
                      }
                    });
                }
                else {
                  $logService.LogMessage('not sure how we got here: ' + JSON.stringify(err));
                }
                $logService.LogMessage('don\'t you love logging?');
              })
              .then(function (data) {
                $logService.LogMessage('raw data from initialize?' + JSON.stringify(data));
                if (data.status === 'scanResult' && !(contains(addresses, data.address))) {
                  $logService.LogMessage('pushing new data: 1 ' + JSON.stringify(data));
                  $scope.devices.push(data);
                }
                else {
                  $logService.LogMessage('stopping scan');
                  return $cordovaBluetoothle.stopScan();
                }
              }, function (error) {
                $logService.LogError(error, 'Error while scanning:');
              }, function (notify) {
                $logService.LogMessage('still scanning: ' + JSON.stringify(notify));
              });
          }).then(function (result) {
            $logService.LogMessage('we\'re done here? ' + JSON.stringify(result));
          }).then(function (result) {
            $logService.LogMessage('this happens last.' + JSON.stringify(result));
          });
        $logService.LogMessage('this happens first...');
    };

    $scope.clearLog = function () {
      $logService.Clear();
    };

}])

.controller('RegistrationCtrl', function(){

});
