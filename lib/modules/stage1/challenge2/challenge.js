var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 2',
        uriPart: '/hello',
        method: 'GET',
        templatePath: __dirname,
        teamCities: {},

        getRequestObject: function(team) {
            var city = challenge.getRandomCity();
            // TODO this is broken for testing purposes
            this.addTeamAttribute(team, 'city', 'kptaom'+city);

            return {
                uri: this.generateURI(team),
                method: challenge.method,
                qs: {
                    text: city
                }
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
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

            return city;
        },


        conditionsMatch: function(team, body, response) {
            return  body.trim() == this.getTeamAttribute(team,'city') &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;