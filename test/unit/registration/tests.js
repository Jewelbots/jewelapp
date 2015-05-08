'use strict';
describe('RegistrationController', function(){
  var $httpBackend, $scope, $state, ctrl, jewelbotServiceStub;
  jewelbotServiceStub = {
    IsPaired : function() {},
    GetDevices : function() {}
  };

  beforeEach(module('jewelApp'), function($provide){
    $provide.value('JewelbotService', jewelbotServiceStub);
  });

  describe('PairCtrl', function() {
    beforeEach(inject(function($rootScope, $controller, _$window_,_$httpBackend_, _$state_){
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $state = _$state_;

      ctrl = $controller('PairCtrl', {
        $scope: $scope,
        $state: $state,
        JewelbotService: jewelbotServiceStub
      });
    }));
    it('should return a list of Jewelbot devices in proximity', function() {
      var listOfDevices = [
        {
          name: 'Bob Jewelbot',
          id : '1'
        },
        {
          name: 'Alice Jewelbot',
          id : '2'
        }
      ];
      jewelbotServiceStub.GetDevices = jasmine.createSpy('GetDevices').and.returnValue(listOfDevices);
      var result = $scope.availableDevices();
      expect(result).toEqual(listOfDevices);
    });
    it('should report when BLE is disabled', function(){
      jewelbotServiceStub.GetDevices = jasmine.createSpy('GetDevices').and.returnValue(function() {
        return new Error('No device found');
      });
      var result = $scope.availableDevices();
      expect(result() instanceof Error).toBeTruthy();
    });
    it('should let a user choose a device to pair to', function(){

    });
  });
});

  //it('Does not require any information except Age', function() {
  //
  //});
  //it('let\'s a user put in their email address', function() {
  //
  //
  //});


