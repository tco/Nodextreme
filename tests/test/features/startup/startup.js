define([
    'jquery',
    'transparency',
    'features/startup/startup',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Startup, /*tools,*/ testtools) {

    var self = this,
        startup;

    transparency.register($);

    describe('StartupFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            startup = new Startup();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(startup).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                startup.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                startup.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                startup.render();
                expect($('#startup')).to.not.be.empty();
                expect($('#startup').text()).to.eql("somestring");
            });
        });

    });
});
