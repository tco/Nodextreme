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
            return {
                uri: this.generateURI(team),
                method: challenge.method,
                qs: {
                    text: city
                }
            };
        },

        validate: function(body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(body, response));
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

            //this.teamCities[team.get('host')] = city;
            this.checkFor = city;

            return this.checkFor;
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