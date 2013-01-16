define([
    'jquery',
    'transparency',
    'features/socket/socket',
    /*'tools',*/
    'lib/testtools'
], function($, transparency, Socket, /*tools,*/ testtools) {
    "use strict";

    var self = this,
        socket;

    transparency.register($);

    describe('SocketFeature', function() {
        beforeEach(function(){
            testtools.beforeEach();
            socket = new Socket();
        });

        afterEach(function(){
            testtools.afterEach();
        });

        describe('#initialize', function() {
            it('should initialize successfully', function() {
                expect(socket).to.be.ok();
            });
        });

        // Event tests

        describe('#eventPublish', function () {
            it('should publish event', function(done) {
                socket.subscribe('eventName', function(eventData) {
                    // expect(eventData).to.be(something);
                    done();
                });
                socket.methodWhichShouldPublishEvent();
            });
        });

        // DOM tests

        describe('#render', function() {
            it('should render to DOM', function() {
                socket.render();
                expect($('#socket')).to.not.be.empty();
                expect($('#socket').text()).to.eql("somestring");
            });
        });

    });
});
