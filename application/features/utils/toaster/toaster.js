define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap-alert',
    'features/VisibleFeature',
    'features/featureContainer'
], function($, _, Backbone, toaster, VisibleFeature, FeatureContainer, undefined) {
    "use strict";

    // Toaster Feature
    // ------------------------------

    var ToasterFeature = VisibleFeature.extend({

        name: 'ToasterFeature',
        element: '#toaster',
        templateId: '#toaster-alert',
        globalEvents: {
            'ajaxError': 'handleError',
            'toaster.message': 'messageReceived'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.templateId);
                self.resolve(true);
            });
        },

        messageReceived: function(eventData) {
            var data = {
                'alert-heading': 'MESSAGE RECEIVED!',
                'alert-message': eventData.data.originalData.message
            };

            var elem = this.getTemplate(this.templateId);
            elem.render(data);

            this.$el.append(elem);
            elem.queue(function() {
                setTimeout(function() {
                    elem.dequeue();
                    elem.remove();
                }, 5000);
            });
        },

        handleError: function(eventData) {
            var head = 'Error',
                message = 'Ajax request failed!';

            var data = {
                'alert-heading': head,
                'alert-message': message
            };

            var elem = this.getTemplate(this.templateId);
            elem.render(data);

            this.$el.append(elem);
            elem.queue(function() {
                setTimeout(function() {
                    elem.dequeue();
                    elem.remove();
                }, 2000);
            });
        },

        render: function() {
            var self = this;

            if(!self.isRendered()) {
                $('body').append('<div id="toaster"></div>');
                self.setElement(self.element);
                self.setRendered(true);
            }
        }

    });

    return ToasterFeature;

});
