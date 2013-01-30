var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 4',
        uriPath: '/calc/add/',
        method: 'GET',
        templatePath: __dirname,

        getRequestObject: function(team) {
            this.addTeamAttribute(team, 'n1', Math.floor(Math.random() * 100));
            this.addTeamAttribute(team, 'n2', Math.floor(Math.random() * 100));

            this.uriPart = this.uriPath + this.getTeamAttribute(team, 'n1') + '/' + this.getTeamAttribute(team, 'n2');
            this.addTeamAttribute(team, 'sum', (this.getTeamAttribute(team, 'n1') + this.getTeamAttribute(team, 'n2')));

            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
        },

        conditionsMatch: function(team, body, response) {
            return  body.trim() == this.getTeamAttribute(team, 'sum') &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }


    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;