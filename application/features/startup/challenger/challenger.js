define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature',
    'features/featureContainer',
    'features/startup/status/status'
], function($, _, Backbone, VisibleFeature, FeatureContainer, Status, undefined) {
    "use strict";

    // Challenger Feature
    // ------------------------------

    var ChallengerFeature = VisibleFeature.extend({

        name: 'ChallengerFeature',
        uiName: 'Challenger',
        element: '#challenger',
        container: '#StartupFeature',

        globalEvents: {
            'challenger.challenge': 'challengeResponse',
            'challenger.advanced': 'advancedHandler'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.features = new FeatureContainer();

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.element, true);
                self.resolve(true);
                self.getChallenge();
            });

        },

        getChallenge: function() {
            this.publish("socket.send", {
                data: {
                    context: 'challenger',
                    action: 'challenge'
                }
            });
        },

        advancedHandler: function() {
            this.getChallenge();
        },

        challengeResponse: function(eventData) {
            this.render(eventData.data.originalData.challenge);
        },

        render: function(challenge) {

            var directives = {
                    body: {
                        html: function() {
                            return this.body;
                        }
                    }
                };

            if(!this.isRendered()) {
                this.setElement(this.container);
                this.setRendered(true);
            }

            this.$el.html(this.$template.render(challenge, directives));
            this.registerFeature(new Status(this.$el.find('#status-container'), challenge));

            // if(challenge.finished) {}

        },

        testResponse: function(eventData) {
            var success = eventData.data.success;

            if(success) {
                this.testSuccess();
            } else {
                this.testFailure(eventData);
            }
        },

        testSuccess: function() {
            this.getChallenge();
        },

        testFailure: function() {

        }



    });

    return ChallengerFeature;

});
