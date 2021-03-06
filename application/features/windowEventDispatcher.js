/*global window,CollectGarbage */
define([
    'jquery',
    'underscore',
    'backbone',
    'features/baseFeature'
], function($, _, Backbone, BaseFeature, undefined) {
    "use strict";

    // WindowEventDispatcher Feature
    // ------------------------------

    var WindowEventDispatcherFeature = BaseFeature.extend({

        name: 'WindowEventDispatcherFeature',

        resizeDelay: 500,
        resizeTimeout: undefined,

        windowEvents: {
            'resize': 'resize',
            'unload': 'unload',
            'keydown': 'keydown'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred().resolve(true);
            self.setRenderable(false);

            self.initDispatcher();

        },

        initDispatcher: function() {
            var self = this;
            _.each(self.windowEvents, function(eventHandler, eventName, handlers) {
                if(_.isFunction(self[eventHandler])) {
                    $(window).on(eventName, _.bind(self[eventHandler], self));
                }
            });

        },

        resize: function() {
            var self = this;
            clearTimeout(self.resizeTimeout);
            self.resizeTimeout = setTimeout(function() {
                self.publish('window.resize');
            }, self.resizeDelay);
        },

        unload: function() {
            if(_.isFunction(CollectGarbage)) {
                CollectGarbage.call();
            }
        },

        // Prevents default key movement events, especially effective in FF
        keydown: function(event) {
            var key = event.keyCode;

            if(this.isInput(event.target)) {
                return;
            }

            //Arrow keys and space
            if(key === 37 || key === 39 || key === 38 || key === 40 || key === 32) {
                // TODO: make check for input fields

                event.preventDefault();
            }
        },

        isInput: function(target) {
            var inputNodes = [
                'INPUT',
                'TEXTAREA'
            ];
            return _.contains(inputNodes, target.nodeName);
        }

    });

    return WindowEventDispatcherFeature;

});
