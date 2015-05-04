'use strict';
describe('DashboardControllers', function(){
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
    it('hasId returns null if App ID does not Exist', function(){
      $scope.startUp();
      var result = $scope.id;
      expect(result).toEqual(1000);
    });
  });
});
//'use strict';
//describe('testcontroller', function() {
//  it('returns false', function() {
//    expect(1).toEqual(2);
//  });
//});
