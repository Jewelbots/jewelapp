'use strict';
describe('Registration', function() {
    it('Creates Id If it doesn\'t exist', function(appController) {
      var fauxId = '9DB6249A-D36E-4FE9-ACED-6885BCF2721D';
      var controller = appController.startup(fauxId);
      expect(controller.appId).toBe('9DB6249A-D36E-4FE9-ACED-6885BCF2721D');
    });
    it('uses existing ID if it does', function(){
      expect(1).toBe(1);
    });
    it('Reports when BLE is disabled', function() {

    });
    it('Does not require any information except Age', function() {

    });
    it('let\'s a user put in their email address', function() {


    });
    it ('shows available devices', function() {

    });
    it('directs user to pairing screen if not paired', function() {

    });
    it('does not ask for phone number if user is using an ipod touch', function() {

    });
    it('asks for phone number if user is using an Android phone or IPhone', function() {

    });
});
