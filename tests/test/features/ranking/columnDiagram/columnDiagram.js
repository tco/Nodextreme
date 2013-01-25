define([
    'jquery',
    'transparency',
    'features/ranking/columnDiagram/columnDiagram',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, ColumnDiagram, /*tools,*/ testtools) {
    "use strict";

    var self = this,
        columnDiagram;

    transparency.register($);

    describe('ColumnDiagramFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            columnDiagram = new ColumnDiagram();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(columnDiagram).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                columnDiagram.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                columnDiagram.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                columnDiagram.render();
                expect($('#column-diagram')).to.not.be.empty();
                expect($('#column-diagram').text()).to.eql("somestring");
            });
        });

    });
});
