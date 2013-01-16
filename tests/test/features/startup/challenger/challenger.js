define([
    'jquery',
    'transparency',
    'features/startup/challenger/challenger',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Challenger, /*tools,*/ testtools) {

    var self = this,
        challenger;

    transparency.register($);

    describe('ChallengerFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            challenger = new Challenger();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(challenger).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                challenger.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                challenger.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                challenger.render();
                expect($('#challenger')).to.not.be.empty();
                expect($('#challenger').text()).to.eql("somestring");
            });
        });

    });
});
