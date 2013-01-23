var _ = require('underscore'),
    Backbone = require('backbone'),
    NodextremeModules = require('./modules/modules.js').NodextremeModules,
    Team = Backbone.Model.extend({

        defaults: {
            challenges: [],
            points: 0,
            stage: 1,
            challenge: 1,
            failures: 0,
            regression: [],
            finished: false
        },

        start: function() {

            var self = this;
            this.challenger = setTimeout(function() {
                self.challenge.call(self);
            }, 10000);
            return true;

        },

        challenge: function() {

            var team = this,
                challenge = NodextremeModules.getChallenge(this.get('stage'), this.get('challenge')),
                regression = false;

            console.log("Challenging", team.get('name'), "with", challenge.name);

            challenge.request(this, this.requestHandler, this, regression);

            // Handle regression
            this.runRegressionRequests();

            // Challenge again in 10 seconds
            this.challenger = setTimeout(function() {
                team.challenge.call(team);
            }, 10000);

        },

        requestHandler: function(team, challenge, success, regression) {

            var points = this.get('points');

            if(success) {

                points += challenge.index;

                if(!regression) {
                    team.advance();
                }

            } else {

                if(regression) {
                    points -= challenge.index;
                }

            }

            team.set('points', points);

        },

        advance: function() {

            if(NodextremeModules.isLastChallenge(this.get('stage'), this.get('challenge'))) {
                this.set('finished', true);
            } else {
                var challenge = this.get('challenge');
                this.get('regression').push({
                    stage: this.get('stage'),
                    challenge: challenge
                });
                challenge++;
                this.set('challenge', challenge);
            }

        },

        fail: function() {

            var failures = this.get('failures');
            failures++;
            this.set('failures', failures);

        },

        runRegressionRequests: function() {

            var team = this,
                regression = true;
            _.each(this.get('regression'), function(proxy) {
                var challenge = NodextremeModules.getChallenge(proxy.stage, proxy.challenge);
                challenge.request(team, team.requestHandler, team, regression);
            });

        }
    }),
    Teams = Backbone.Collection.extend({
        model: Team
    }),
    teams = new Teams(),
    NodextremeTeams = {
        add: function(name, port, host) {

            if(!NodextremeTeams.isRegistered(host)) {
                teams.add({
                    name: name,
                    port: port,
                    host: host
                });
                teams.trigger('change');
                return true;
            }
            return false;

        },
        get: function(host) {
            return _.first(teams.where({ host: host }));
        },
        isRegistered: function(host) {

            var found = teams.where({ host: host }).length;

            if(found === 1) {
                return true;
            }
            return false;

        },
        registerListener: function(action, listener) {
            teams.on(action, listener);
        },
        startAll: function() {
            teams.each(function(team) {
                team.start();
            });
        },
        getRanking: function() {
            var ranking = [];

            teams.each(function(team) {
                ranking.push({
                    name: team.get('name'),
                    points: team.get('points')
                });
            });

            return ranking;
        }
    };
//var

exports.NodextremeTeams = NodextremeTeams;