var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 4',
        uriPath: '/calc/add/',
        method: 'GET',
        templatePath: __dirname,

        getRequestObject: function(team) {
            var n1 = Math.floor(Math.random() * 100),
                n2 = Math.floor(Math.random() * 100);

            this.uriPart = this.uriPath + n1 + '/' + n2;
            this.checkFor = (n1 + n2);

            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(body, response));
        },

        conditionsMatch: function(body, response) {
            return  body.trim() == this.checkFor &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }


    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;