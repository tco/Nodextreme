define([
    'jquery',
    'underscore',
    'backbone',
    'features/VisibleFeature'
], function($, _, Backbone, VisibleFeature, undefined) {
    "use strict";

    // Status Feature
    // ------------------------------

    var StatusFeature = VisibleFeature.extend({

        name: 'StatusFeature',
        uiName: 'Status',
        challengesId: '#challenges',
        challengesTemplate: '#status-challenge',
        timerTemplate: '#request-timer',
        timerId: '#timer',
        statusTemplate: '#status',

        started: false,
        challenges: [],

        globalEvents: {
            'challenger.challenge': 'challengeHandler',
            'ranking.update':       'resetTimer',
            'game.start':           'gameStarted'
        },

        initialize: function($element, challenge) {
            var self = this;

            self.loaded = $.Deferred();
            console.log(challenge);
            self.challenges.push(challenge);

            self.when(self.templatesResolved(),function() {
                self.setElement($element);
                self.$statusTemplate = self.getTemplate(self.statusTemplate, true);
                self.$timerTemplate = self.$statusTemplate.find(self.timerTemplate);
                self.$challengesTemplate = self.getTemplate(self.challengesTemplate, true);
                self.$template = self.getTemplate(self.element);

                self.renderChallenges();

                self.resolve(true);
            });

        },

        challengeHandler: function(eventData) {
            console.log(eventData);

        },

        renderChallenges: function() {
            if(!this.challengesRendered) {
                this.$el.find(this.challengesId).append(this.$challengesTemplate);
                this.challengesRendered = true;
            }
            var challenges = _.map(this.challenges, function(c) { return { challenge: c.name }; });
            console.log(challenges);

            console.log(this.$challengesTemplate);

            this.$challengesTemplate.render({
                challenge: challenges
            });
        },

        gameStarted: function() {
            this.started = true;
            this.resetTimer();
        },

        resetTimer: function() {
            var self = this;

            if(this.started) {
                this.timerSeconds = 10;

                clearTimeout(this.timer);

                this.timer = setTimeout(function timer() {
                    self.updateTimer();
                    self.timerSeconds--;
                    if(self.timerSeconds === -1) {
                        clearTimeout(self.timer);
                    } else {
                        self.timer = setTimeout(timer, 1000);
                    }
                }, 1000);
            }
        },

        updateTimer: function() {
            var seconds, timer;
            if(this.timerSeconds === 0) {
                seconds = '00:00';
            } else {
                seconds = '0' + (this.timerSeconds / 100).toFixed(2).toString().replace(".", ":");
            }
            timer = {
                'request-timer-value': seconds
            };
            if(!this.timerTemplateRendered) {
                this.timerTemplateRendered = true;
                this.$el.find(this.timerId).html(this.$timerTemplate.render(timer));
            } else {
                this.$timerTemplate.render(timer);
            }
        },

        asyncRender: function() {
            var self = this;

            if(self.isRendered()) {
                self.render();
            }
        },

        render: function($element) {
        }
    });

    return StatusFeature;

});
