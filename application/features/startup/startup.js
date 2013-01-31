define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature',
    'features/featureContainer',
    'features/startup/challenger/challenger'
], function($, _, Backbone, VisibleFeature, FeatureContainer, Challenger, undefined) {
    "use strict";

    // Startup Feature
    // ------------------------------

    var StartupFeature = VisibleFeature.extend({

        name: 'StartupFeature',
        uiName: 'Startup',
        element: '#startup',

        events: {
            'click #send-registration-details': 'registerClick'
        },

        globalEvents: {
            'navigation.activeFeatureSet': 'activated',
            'startup.register': 'registerResponse',
            'startup.state': 'loadState',
            'socket.connected': 'getState'
        },

        routes: {
            'startup': 'render'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.features = new FeatureContainer();

            //self.features.on('add', self.asyncRender, self);

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.element);
                self.resolve(true);
            });

            self.publish('router.registerRoutes', self);
            self.publish('moduleInitialized', self);

        },

        asyncRender: function() {
            var self = this;

            if(self.isRendered()) {
                self.render();
            }
        },

        render: function() {
            var self = this;

            if(!self.isRendered()) {
                self.setElement(self.join("#", self.name));
                self.$el.append(self.$template);
                self.setRendered(true);
            }
        },

        activated: function(featureActivated) {
            this.featureActivated.call(this, featureActivated);
        },

        registerClick: function(event) {
            var teamName = $("#team-name").val(),
                port = $("#port").val();

            this.register(teamName, port);
        },

        getState: function() {
            this.publish('socket.send', {
                data: {
                    action: 'state',
                    context: 'startup'
                }
            });
        },

        loadState: function(eventData) {
            if(eventData.data.status === 'SUCCESS') {
                this.loadChallenger();
            }
        },

        register: function(teamName, port) {
            this.publish("socket.send", {
                data: {
                    action: 'register',
                    parameters: {
                        teamName: teamName,
                        port: port
                    },
                    context: 'startup'
                }
            });
        },

        registerResponse: function(eventData) {
            if(eventData.data.status === 'SUCCESS') {
                this.loadTeamInfo(eventData);
                this.loadChallenger();
            }
        },

        loadTeamInfo: function(data) {
            // this.registerFeature(new TeamInfo(data));
        },

        loadChallenger: function() {
            this.registerFeature(new Challenger);
        }

    });

    return StartupFeature;

});
