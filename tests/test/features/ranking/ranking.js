define([
    'jquery',
    'transparency',
    'features/ranking/ranking',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Ranking, /*tools,*/ testtools) {

    var self = this,
        ranking;

    transparency.register($);

    describe('RankingFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            ranking = new Ranking();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(ranking).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                ranking.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                ranking.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                ranking.render();
                expect($('#ranking')).to.not.be.empty();
                expect($('#ranking').text()).to.eql("somestring");
            });
        });

    });
});
