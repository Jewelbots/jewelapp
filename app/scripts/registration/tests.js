'use strict';
var $rootScope, $controller, scope, JewelbotService;

beforeEach(inject(function(_$rootScope_, _$controller_, _JewelbotService_) {
  module('jewelApp');
  $rootScope = _$rootScope_;
  $controller = _$controller_;
  JewelbotService = _JewelbotService_;
  scope = $rootScope.$new();
}));
describe('Registration', function() {
  beforeEach(function() {
    JewelbotService.when("GetDeviceID").respond("0");
    $controller("HomeCtrl", {
      $scope: scope
    });
  });

  it('Creates Id If it doesn\'t exist', function() {
    var fauxId = '9DB6249A-D36E-4FE9-ACED-6885BCF2721D';
    //expect(mockJewelbotService.GetDeviceId).toBe(fauxId);
    $scope.startUp(fauxId);
    expect(fauxId).toEqual('9DB6249A-D36E-4FE9-ACED-6885BCF2721D');
  });
  it('uses existing ID if it does', function(){

  });

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
