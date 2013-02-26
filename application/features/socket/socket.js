define([
    'jquery',
    'underscore',
    'backbone',
    'features/baseFeature',
    'features/featureContainer',
    'lib/socket.io',
    'config'
], function($, _, Backbone, BaseFeature, FeatureContainer, io, config, undefined) {
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

            self.socket = io.connect();

            self.socket.on('connect', function() {
                self.connected = true;
                self.publish('socket.connected');
            });

            self.socket.on('data', function(message) {
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
                self.socket.emit('data', data);
            } else {
                throw new Error("Socket.io not connected");
            }

        },

        handleMessage: function(message) {
            var parsed = JSON.parse(message);
            if(config.DEBUG) {
                console.log(parsed);
            }
            this.publish(this.join(parsed.originalData.context, ".",  parsed.originalData.action), {
                data: parsed
            });

        }

    });

    return SocketFeature;

});
