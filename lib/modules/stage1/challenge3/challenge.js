var fs = require('fs'),
    $ = require('jquery'),
    request = require('request'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 3',
        uriPart: '/how/many/pamela',
        templatePath: __dirname,
        method: 'GET',


        getRequestObject: function(team) {
            return {
                uri: this.generateURI(team),
                method: challenge.method
            };
        },

        validate: function(body, response, $deferred) {
            var challenge = this;

            request({
                uri: "https://www.google.com/search",
                qs: {
                    q: "Pamela+Anderson"
                }
            }, function(error, requestResponse, body) {

                var success = false;

                if(!error && requestResponse.statusCode === 200) {

                    $stats = $(body).find("#resultStats");
                    var pamelas = parseInt($stats.text().replace(/[^\d]*/g, ""), 10);

                    success = body.indexOf(pamelas) != -1;

                }

                $deferred.resolve(success);

            });

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