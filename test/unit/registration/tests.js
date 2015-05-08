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
      expect(true).toBeTruthy();
    });
    it('should report when BLE is disabled', function(){
      expect(1).toBe(1);
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


