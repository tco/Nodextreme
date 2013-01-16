define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature',
    'features/featureContainer'
], function($, _, Backbone, VisibleFeature, FeatureContainer, undefined) {
    "use strict";

    // Welcome Feature
    // ------------------------------

    var WelcomeFeature = VisibleFeature.extend({

        name: 'WelcomeFeature',
        uiName: 'Welcome',
        element: '#welcome',

        globalEvents: {
            'navigation.activeFeatureSet': 'activated'
        },

        routes: {
            '':         'render',
            'welcome':  'render'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.when(self.templatesResolved(),function() {
                self.$template = self.getTemplate(self.element, true);
                self.resolve(true);
            });

            self.publish('router.registerRoutes', self);
            self.publish('moduleInitialized', self);

        },

        render: function() {
            var self = this;

            if(!self.isRendered()) {
                self.setElement(self.join("#",self.name));
                self.$el.append(self.$template);
                self.setRendered(true);
            }
        },

        activated: function(featureActivated) {
            this.featureActivated.call(this, featureActivated);
        }

    });

    return WelcomeFeature;

});
