var _ = require('underscore'),
    Backbone = require('backbone'),
    NodextremeModules = require('./modules/modules.js').NodextremeModules,
    challengerTimeout = 11000,
    requestTimeMultiplier = 150,
    Team = Backbone.Model.extend({
        defaults: {
            challenger: null,
            challenges: {},
            points: 0,
            stage: 1,
            challenge: 1,
            failures: 0,
            regression: [],
            finished: false
        },

        start: function() {

            var team = this;
            // Start challenger
            this.set('challenger',setTimeout(function() {
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
                challenge = NodextremeModules.getChallenge(this.get('stage'), this.get('challenge')),
                regression = false;

            console.log("Challenging", team.get('name'), "with", challenge.name);

            //Make the challenge request
            challenge.request(this, this.requestHandler, this, regression);

            // Handle regression
            this.runRegressionRequests(team.get('name'));

            // Challenge again in 10 seconds
            this.set('challenger', setTimeout(function() {
                // Again with correct scope
                team.challenge.call(team);
            }, challengerTimeout + team.get('regression').length * requestTimeMultiplier));

        },

        requestHandler: function(team, challenge, success, regression) {
            var points = this.get('points');

            if(success) {
                points += challenge.index;

                if(!regression) {
                    team.advance();
                }

            } else {
                this.fail();
                if(regression) {
                    points -= challenge.index;
                }
            }

            var teamChallenges = this.get('challenges');
            teamChallenges[challenge.name] = success;
            this.set('challenges', teamChallenges);
            NodextremeTeams.teamChallenges(this);

            team.set('points', points);
        },

        advance: function() {
            var challenge = NodextremeModules.getChallenge(this.get('stage'), this.get('challenge'));

            if(NodextremeModules.isLastChallenge(this.get('stage'), this.get('challenge'))) {
                this.set('finished', true);
                this.stop();

                NodextremeTeams.teamAdvanced(this, challenge, true);
            } else {
                NodextremeTeams.teamAdvanced(this, challenge, false);
                var challengeIndex = this.get('challenge'),
                    regressions = this.get('regression'),
                    ob = {
                        stage: this.get('stage'),
                        challenge: challengeIndex
                    },
                    exists = _.filter(regressions, function(r) { return r.challenge == ob.challenge; }).length;

                challengeIndex++;
                console.log("EXISTS -----------------",exists, ob);
                if(!exists) {
                    regressions.push(ob);
                }

                
                this.set('challenge', challengeIndex);
            }
        },

        fail: function() {

            var failures = this.get('failures');
            failures++;
            this.set('failures', failures);

        },

        runRegressionRequests: function(name) {
            console.log("The team is",name, this.get('regression'));
            var team = this,
                regression = true;
            _.each(this.get('regression'), function(proxy) {
                console.log("regression test",team.get('name'),proxy.challenge);
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
        add: function(name, port, host, connectionId) {

            if(!NodextremeTeams.isRegistered(host)) {
                teams.add({
                    name: name,
                    port: port,
                    host: host,
                    connectionId: connectionId
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