define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature',
    'features/featureContainer'
], function($, _, Backbone, VisibleFeature, FeatureContainer, undefined) {
    "use strict";

    // Challenger Feature
    // ------------------------------

    var ChallengerFeature = VisibleFeature.extend({

        name: 'ChallengerFeature',
        uiName: 'Challenger',
        element: '#challenger',
        container: '#StartupFeature',

        events: {
            'click button#test': 'handleTest'
        },

        globalEvents: {
            'challenger.challenge': 'challengeResponse',
            'challenger.test': 'testResponse'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.element, true);
                self.resolve(true);
                self.getChallenge();
            });

        },

        eventHandler: function(eventData) {
			// doMagicOnEventTriggered
        },

        getChallenge: function() {
            this.publish("socket.send", {
                data: {
                    action: 'challenge',
                    context: 'challenger'
                }
            });
        },

        challengeResponse: function(eventData) {
            this.render(eventData.data.originalData.challenge);
        },

        render: function(challenge) {

            var self = this,
                directives = {
                    body: {
                        html: function() {
                            return this.body;
                        }
                    }
                };

            if(!self.isRendered()) {
                self.setElement(self.container);
                self.setRendered(true);
            }

            self.$el.html(self.$template.render(challenge, directives));

            if(challenge.finished) {
                self.$template.find('#test').addClass('hide');
            }

        },

        handleTest: function() {
            this.publish('socket.send', {
                data: {
                    action: 'test',
                    context: 'challenger'
                }
            });
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
