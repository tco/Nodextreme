var fs = require('fs'),
    request = require('request'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 2',
        uriPart: '/hello',
        method: 'GET',
        templatePath: __dirname,

        request: function(team, connection, data) {

            var challenge = this,
                city = challenge.getRandomCity();

            request({
                uri: challenge.generateURI(team),
                method: challenge.method,
                qs: {
                    text: city
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        connection.write(challenge.validate(team, data, body, response));
                } else {
                    connection.write(challenge.failure(team, data));
                }
            });
        },

        validate: function(team, data, body, response) {
            var challenge = this;

            if(challenge.conditionsMatch(body, response)) {
                return challenge.success(team, data);
            }
            return challenge.failure(team, data);
        },

        getRandomCity: function() {
            var cities = [
                    'Helsinki',
                    'Moscow',
                    'Stockholm',
                    'Los Angeles',
                    'Madrid',
                    'Rome',
                    'Rio'
                ],
                city = cities[ Math.floor(Math.random() * cities.length) ];

                this.checkFor = city + "!";

            return this.checkFor;
        },


        conditionsMatch: function(body, response) {
            return  body.indexOf(this.checkFor) != -1 &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge: new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;