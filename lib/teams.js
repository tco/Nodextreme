var _ = require('underscore'),
    Backbone = require('backbone'),
    NodextremeModules = require('./modules/modules.js').NodextremeModules,
    challengerTimeout = 11000,
    requestTimeMultiplier = 150,
    Team = Backbone.Model.extend({

        start: function() {

            var team = this;
            this.stop();
            // Start challenger
            this.set('challenger', setTimeout(function() {
                // Call with correct scope
                team.challenge.call(team);
            }, challengerTimeout));
            return true;

        },

        stop: function() {
            // Stop challenger
            clearTimeout(this.get('challenger'));
        },

        challenge: function() {

            var team = this,
                challenge = NodextremeModules.getChallenge(team.get('stage'), team.get('challenge')),
                regression = false;

            //Make the challenge request
            challenge.request(team, team.requestHandler, team, regression);

            // Handle regression
            team.runRegressionRequests(team);

            // Challenge again in 10 seconds
            team.set('challenger', setTimeout(function() {
                // Again with correct scope
                team.challenge.call(team);
            }, challengerTimeout + team.get('regression').length * requestTimeMultiplier));

        },

        requestHandler: function(team, challenge, success, regression) {
            var points = team.get('points');

            if(success) {
                points += challenge.index;

                if(!regression) {
                    team.advance(team);
                }

            } else {
                team.fail();
                if(regression) {
                    points -= challenge.index;
                }
            }

            var teamChallenges = team.get('challenges');
            teamChallenges[challenge.name] = {
                success: success,
                data: challenge.renderChallengeBody(team)
            };
            team.set('challenges', teamChallenges);

            NodextremeTeams.teamChallenges(team);

            team.set('points', points);
        },

        advance: function(team) {
            var challenge = NodextremeModules.getChallenge(team.get('stage'), team.get('challenge'));

            if(NodextremeModules.isLastChallenge(team.get('stage'), team.get('challenge'))) {

                team.set('finished', true);
                team.stop();
                NodextremeTeams.teamAdvanced(team, challenge, true);

            } else {

                NodextremeTeams.teamAdvanced(team, challenge, false);

                var challengeIndex = team.get('challenge'),
                    regressions = team.get('regression'),
                    ob = {
                        stage: team.get('stage'),
                        challenge: challengeIndex
                    },
                    exists = _.filter(regressions, function(r) { return r.challenge == ob.challenge; }).length;

                if(!exists) {
                    regressions.push(ob);
                }

                challengeIndex++;

                team.set('challenge', challengeIndex);
            }
        },

        fail: function() {

            var failures = this.get('failures');
            failures++;
            this.set('failures', failures);

        },

        runRegressionRequests: function(team) {
            var regression = true;

            _.each(team.get('regression'), function(proxy) {
                var challenge = NodextremeModules.getChallenge(proxy.stage, proxy.challenge);
                challenge.request(team, team.requestHandler, team, regression);
            });

        }
    }),
    Teams = Backbone.Collection.extend(),
    teams = new Teams(),
    NodextremeTeams = {
        add: function(name, port, host, connection) {

            if(!NodextremeTeams.isRegistered(host.address)) {
                teams.add(new Team({
                    name: name,
                    port: port,
                    host: host.address,
                    connection: connection,
                    challenger: null,
                    challenges: {},
                    points: 0,
                    stage: 1,
                    challenge: 1,
                    failures: 0,
                    regression: [],
                    finished: false
                }));
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
        teamChallenges: function(team) {
            teams.trigger('challenges', team);
        },
        teamAdvanced: function(team, challenge, finished) {
            teams.trigger('advance', team, challenge, finished);
        },
        registerListener: function(action, listener) {
            teams.on(action, listener);
        },
        startAll: function() {
            teams.each(function(team) {
                team.start();
            });
        },
        stopAll: function() {
            teams.each(function(team) {
                team.stop();
            });
        },
        getRanking: function() {
            var ranking = [];

            teams.each(function(team) {
                ranking.push({
                    name: team.get('name'),
                    points: team.get('points'),
                    failures: team.get('failures')
                });
            });

            return ranking;
        }
    };
//var

exports.NodextremeTeams = NodextremeTeams;