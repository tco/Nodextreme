define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature',
    'features/featureContainer'
], function($, _, Backbone, VisibleFeature, FeatureContainer, undefined) {
    "use strict";

    // Ranking Feature
    // ------------------------------

    var RankingFeature = VisibleFeature.extend({

        name: 'RankingFeature',
        uiName: 'Ranking',
        element: '#ranking',

        globalEvents: {
            'navigation.activeFeatureSet': 'activated'
        },

        routes: {
            'ranking': 'render'
        },

        initialize: function() {
            var self = this;

            self.loaded = $.Deferred();

            self.features = new FeatureContainer();

            self.features.on('add', self.asyncRender, self);

            self.when(self.templatesResolved(),function() {
              self.$template = self.getTemplate(self.element);
              self.resolve(true);
            });

            self.publish("router.registerRoutes", self);
            self.publish("moduleInitialized", self);

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
        }

    });

    return RankingFeature;

});
