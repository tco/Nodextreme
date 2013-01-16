var fs = require('fs'),
    request = require('request'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 1',
        uriPart: '/hello',
        method: 'GET',
        templatePath: __dirname,
        checkFor: 'World!',

        request: function(team, connection, data) {

            var challenge = this;

            request({
                uri: challenge.generateURI(team),
                method: challenge.method
            }, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    connection.write(challenge.validate(team, data, body, response));
                } else {
                    connection.write(challenge.failure(team, data));
                }

            });
        },

        test: function(response) {
            response.send(this.checkFor);
        },

        validate: function(team, data, body, response) {

            if(this.conditionsMatch(body, response)) {
                return this.success(team, data);
            }
            return this.failure(team, data);

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