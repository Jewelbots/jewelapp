'use strict';
describe('Controllers', function(){
  var $scope, ctrl;
  beforeEach(module('jewelApp'));
  describe('HomeCtrl', function() {
    var jewelbotService;
    beforeEach(inject(function($rootScope, $controller, JewelbotService){
      jewelbotService = JewelbotService;
      $scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {
      $scope: $scope
      });
    }));
    it('uses existing ID if it does', function(){
      $scope.startUp();
      var result = $scope.id;
      expect(result).toEqual(1000000);
    });
  })
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

