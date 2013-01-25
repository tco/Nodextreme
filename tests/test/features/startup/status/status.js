define([
    'jquery',
    'transparency',
    'features/startup/status/status',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Status, /*tools,*/ testtools) {

    var self = this,
        status;

    transparency.register($);

    describe('StatusFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            status = new Status();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(status).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                status.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                status.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                status.render();
                expect($('#status')).to.not.be.empty();
                expect($('#status').text()).to.eql("somestring");
            });
        });

    });
});
