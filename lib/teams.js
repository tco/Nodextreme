var _ = require('underscore'),
    Backbone = require('backbone'),
    NodextremeModules = require('../modules/modules.js').NodextremeModules,
    Team = Backbone.Model.extend({
        defaults: {
            challenges: [],
            points: 0,
            stage: 1,
            challenge: 1,
            failures: 0,
            finished: false
        },
        advance: function() {
            if(NodextremeModules.isLastChallenge(this.get('stage'), this.get('challenge'))) {
                this.set('finished', true);
            } else {
                var challenge = this.get('challenge');
                challenge++;
                this.set('challenge', challenge);
            }

        },
        fail: function() {
            var failures = this.get('failures');
            failures++;
            this.set('failures', failures);
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
            return _.first(teams.where({ host: host}));
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
        getRanking: function() {
            var ranking = [];

            teams.each(function(team) {
                ranking.push({
                    name: team.get('name'),
                    points: team.get('points')
                });
            });


            return ranking.sort(function(a, b) {
                a.points > b.points;
            });
        }
    };
//var

exports.NodextremeTeams = NodextremeTeams;