var fs = require('fs'),
    $ = require('jquery'),
    request = require('request'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 3',
        uriPart: '/how/many/pamela',
        templatePath: __dirname,
        method: 'GET',

        request: function(team, connection, data, pamelas) {
            var challenge = this;

            request({
                uri: challenge.generateURI(team)
            }, function (error, response, body) {
                //console.log(error, response, body);
                if (!error && response.statusCode == 200) {
                    if(
                        body.indexOf(pamelas) != -1 &&
                        response.headers['content-type'] == 'text/plain' &&
                        response.headers['content-encoding'] == 'utf-8'
                    ) {
                        connection.write(challenge.success(team, data));
                    } else {
                        connection.write(challenge.failure(team, data));
                    }
                } else {
                    connection.write(challenge.failure(team, data));
                }
            });
        },

        test: function(team, connection, data, pamelas) {
            response.write(pamelas);
        },

        validate: function(team, connection, data, callback) {
            var challenge = this;

            request({
                uri: "https://www.google.com/search",
                qs: {
                    q: "Pamela+Anderson"
                }
            }, function(error, response, body) {
                $stats = $(body).find("#resultStats");
                $stats.find("nobr").remove();
                var pamelas = parseInt($stats.text().replace(/[^\d]*/g, ""), 10);

                callback(team, connection, data, pamelas);

            });

        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;