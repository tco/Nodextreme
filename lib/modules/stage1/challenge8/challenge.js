var fs = require('fs'),
    $ = require('jquery'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 8',
        uriPart: '/chess',
        method: 'GET',
        templatePath: __dirname,
        checkFor: 'f6,e4,d2,f3',

        getRequestObject: function(team) {
            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
        },

        conditionsMatch: function(team, body, response) {
            body = body.toLowerCase();

            return  body.trim() == this.checkFor &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;