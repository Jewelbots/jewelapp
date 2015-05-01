'use strict';
describe('Registration', function() {
  beforeEach(angular.injector(module('jewelApp')));
  beforeEach(module('jewelApp.services'));
  var JewelbotService;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('AppStartup', inject(function($scope, $controller) {
    it('Creates Id If it doesn\'t exist', function() {
      inject(function($injector){
        JewelbotService = $injector.get('JewelbotService');
      })
      var fauxId = '9DB6249A-D36E-4FE9-ACED-6885BCF2721D';
      //var $scope = {};
      //var $state = {};
      //var $injector = angular.injector(['jewelApp']);

      var controller = $controller(HomeCtrl, {$scope : $scope, JewelbotService : JewelbotService});

      spyOn(JewelbotService, 'GetDeviceId').andReturn(fauxId);
      $scope.startUp(fauxId);
      //expect($scope.appId).toBe('F4354DB6249A-D36E-4FE9-ACED-6885BCF2721D');
      expect(1).toBe(2);
    });
    it('uses existing ID if it does', function(){
      expect(2).toBe(1);
    });
  }));
  //it('Reports when BLE is disabled', function() {
  //
  //});
  //it('Does not require any information except Age', function() {
  //
  //});
  //it('let\'s a user put in their email address', function() {
  //
  //
  //});
  //it ('shows available devices', function() {
  //
  //});
  //it('directs user to pairing screen if not paired', function() {
  //
  //});
  //it('does not ask for phone number if user is using an ipod touch', function() {
  //
  //});
  //it('asks for phone number if user is using an Android phone or IPhone', function() {
  //
  //});
});
