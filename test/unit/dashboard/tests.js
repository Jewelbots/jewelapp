'use strict';
describe('DashboardControllers', function(){
  var $httpBackend, $scope, $state, ctrl, jewelbotServiceStub;
  jewelbotServiceStub = {
    GetAppId: function() {},
    SetAppId : function() {},
    IsPaired : function() {}
  };
  beforeEach(module('jewelApp'), function($provide){
    $provide.value('JewelbotService', jewelbotServiceStub);
  });

  describe('HomeCtrl', function() {
    beforeEach(inject(function($rootScope, $controller, _$window_,_$httpBackend_, _$state_){
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $state = _$state_;

      ctrl = $controller('HomeCtrl', {
        $scope: $scope,
        $state: $state,
        JewelbotService: jewelbotServiceStub
      });
    }));
    it('hasId returns undefined if App ID does not Exist', function(){
      jewelbotServiceStub.GetAppId = jasmine.createSpy('GetAppId').and.returnValue(undefined);
      jewelbotServiceStub.SetAppId = jasmine.createSpy('SetAppId').and.returnValue(undefined);
      $scope.startUp();
      var result = $scope.appId;
      expect(result).toEqual(undefined);
    });
    it('Generates App Id', function() {
      var seed,
        salt,
        result;
      seed = 1;
      salt = 123456;

      result = $scope.generateAppId(seed, salt);
      expect(result).toEqual('1234561');
    });
    it('transitions to pairing if device is not paired', function() {
      $httpBackend.when('GET', 'templates/friends/add-friends.html').respond(200);
      $httpBackend.when('GET', 'templates/registration/registration-step-two.html').respond(200);
      $httpBackend.when('GET', 'templates/registration/registration-step-three.html').respond(200);
      $httpBackend.when('GET', 'templates/registration/registration-step-four.html').respond(200);
      $httpBackend.when('GET', 'templates/pair_to_device.html').respond(200);
      $httpBackend.when('GET', 'templates/home.html').respond(200);
      $scope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe('home');
            jewelbotServiceStub.IsPaired = jasmine.createSpy('IsPaired').and.returnValue(false);
      $scope.isPaired();

      $httpBackend.when('GET', 'templates/pair.html').respond(200);
      $scope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe('pair');
    });

  });
});
