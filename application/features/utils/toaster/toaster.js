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

        queue: [],

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.templateId);
                self.resolve(true);
            });

            this.queueHandler(this);

        },

        queueHandler: function queueHandler(toaster) {
            var element = toaster.queue.shift(),
                $element = toaster.$el;
            if(element !== undefined) {
                $element.append(element);
                $element.addClass('center');
                setTimeout(function() {
                    $element.addClass('right');
                    setTimeout(function() {
                        element.remove();
                        $element.removeClass('center right');
                        setTimeout(function() {
                            queueHandler(toaster);
                        }, 500);
                    }, 500);
                }, 2000);
            } else {
                setTimeout(function() {
                    queueHandler(toaster);
                }, 200);
            }
        },

        messageReceived: function(eventData) {
            var data = {
                    'alert-heading': 'MESSAGE RECEIVED!',
                    'alert-message': eventData.data.originalData.message
                },
                element = this.getTemplate(this.templateId);

            element.render(data);

            this.queue.push(element);
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
