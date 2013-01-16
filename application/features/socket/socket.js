define([
    'jquery',
    'underscore',
    'backbone',
    'sockjs',
    'features/baseFeature',
    'features/featureContainer'
], function($, _, Backbone, SockJS, BaseFeature, FeatureContainer, undefined) {
    "use strict";

    // Socket Feature
    // ------------------------------

    var SocketFeature = BaseFeature.extend({
        name: 'SocketFeature',
        connected: false,

        globalEvents: {
            'socket.send': 'send'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();
            self.resolve(true);

            self.socket = new SockJS('/SocketChannel');

            self.socket.addEventListener('open', function() {
                self.connected = true;
            });

            self.socket.addEventListener('message', function(message) {
                self.handleMessage(message);
            });

        },

        send: function(dataObject) {
            var self = this,
                data = dataObject.data;

            if( typeof(data) === "object" ) {
                data = JSON.stringify(data);
            }

            if(self.connected) {
                self.socket.send(data);
            } else {
                throw new Error("SockJS not connected");
            }

        },

        handleMessage: function(message) {
            var parsed = JSON.parse(message.data);
            console.log(parsed);
            this.publish(this.join(parsed.originalData.context, ".",  parsed.originalData.action), {
                data: parsed
            });

        }

    });

    return SocketFeature;

});
