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
        challengeResults: {},

        globalEvents: {
            'challenger.challenge': 'challengeHandler',
            'challenger.challenges': 'challengesHandler',
            'ranking.update':       'resetTimer',
            'game.start':           'gameStarted'
        },

        initialize: function($element, challenge, options) {
            var self = this;

            self.loaded = $.Deferred();

            if(options.challenges) {
                _.each(options.challenges, function(challenge, name) {
                    self.challenges.push({
                        name: name,
                        success: challenge.success,
                        body: challenge.data
                    });
                });
                self.challengeResults = _.map(options.challenges, function(challenge, name) {
                    return {
                        name: name,
                        success: challenge.success
                    };
                });
            }

            var ch = _.find(self.challenges, function(ch) {
                return ch.name === challenge.name;
            });

            if(!ch) {
                self.challenges.push(challenge);
                self.currentChallenge = challenge;
            } else {
                self.currentChallenge = _.last(self.challenges);
            }
            

            self.when(self.templatesResolved(),function() {
                self.setElement($element);
                self.$statusTemplate = self.getTemplate(self.statusTemplate, true);
                self.$timerTemplate = self.$statusTemplate.find(self.timerTemplate);
                self.$challengesTemplate = self.getTemplate(self.challengesTemplate, true);
                self.$template = self.getTemplate(self.element);

                self.renderChallenges();
                if(options.challenges) {
                    self.gameStarted();
                }

                self.resolve(true);
            });

        },

        challengeSelected: function(event) {
            var self = this,
                $target = $(event.target).closest('li'),
                name = $target.attr('data-name');

            self.currentChallenge = _.find(this.challenges, function(challenge) {
                return name === challenge.name;
            });

            self.publish('status.challengeSelected', {
                data: {
                    challenge: self.currentChallenge
                }
            });
            self.renderChallenges();
        },

        challengeHandler: function(eventData) {
            this.challenges.push(eventData.data.originalData.challenge);
            this.currentChallenge = eventData.data.originalData.challenge;
            this.renderChallenges();
        },

        challengesHandler: function(eventData) {
            this.challengeResults = _.map(eventData.data.originalData.challenges, function(challenge, name) {
                return {
                    name: name,
                    success: challenge
                };
            });
            this.renderChallenges();
        },

        renderChallenges: function() {
            var self = this;

            if(!self.challengesRendered) {
                self.$el.find(self.challengesId).append(self.$challengesTemplate);
                self.challengesRendered = true;
            }

            var challenges = _.map(self.challenges, function(c) { return { challenge: c.name}; }),
                directives = {
                    'challenge': {
                        'class': function(params) {
                            var success = false,
                                ret = params.value,
                                context = this;

                            _.each(self.challengeResults, function(challenge) {
                                if(challenge.name === context.challenge) {
                                    if(challenge.success) {
                                        success = true;
                                    }
                                }
                            });
                            if(success) {
                                ret += ' success';
                            }
                            if(this.challenge === self.currentChallenge.name) {
                                ret += ' active';
                            }
                            return ret;
                        },
                        'data-name': function() {
                            return this.challenge;
                        }
                    }
                };

            self.$challengesTemplate.render(challenges.reverse(), directives);

            $('#challenges .challenge').off('click').on('click',function(event) {
                self.challengeSelected.call(self, event);
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
