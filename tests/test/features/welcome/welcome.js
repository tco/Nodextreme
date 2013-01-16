define([
    'jquery',
    'transparency',
    'features/welcome/welcome',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Welcome, /*tools,*/ testtools) {

    var self = this,
        welcome;

    transparency.register($);

    describe('WelcomeFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            welcome = new Welcome();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(welcome).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                welcome.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                welcome.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                welcome.render();
                expect($('#welcome')).to.not.be.empty();
                expect($('#welcome').text()).to.eql("somestring");
            });
        });

    });
});
