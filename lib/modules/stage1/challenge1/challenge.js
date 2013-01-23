var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 1',
        uriPart: '/hello',
        method: 'GET',
        templatePath: __dirname,
        checkFor: 'World!',

        getRequestObject: function(team) {
            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(body, response));
        },

        conditionsMatch: function(body, response) {
            return  body.indexOf(this.checkFor) != -1 &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }


    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;