var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 5',
        uriPath: '/calc/',
        method: 'GET',
        templatePath: __dirname,

        getRequestObject: function(team) {
            var n1 = Math.floor(Math.random() * 100),
                n2 = Math.floor(Math.random() * 100),
                method = this.getRandomMethod();

            this.uriPart = this.uriPath + method + '/' + n1 + '/' + n2;

            this.checkFor = this[method](n1, n2);

            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(body, response));
        },

        getRandomMethod: function() {
            var methods = [
                    'add',
                    'reduce',
                    'multiply',
                    'division'
                ],
                method = methods[ Math.floor(Math.random() * methods.length) ];

            return method;
        },

        conditionsMatch: function(body, response) {
            return  body.trim() == this.checkFor &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        },

        add: function(n1, n2) {
            return n1 + n2;
        },

        reduce: function(n1, n2) {
            return n1 - n2;
        },

        division: function(n1, n2) {
            return Math.floor(n1 / n2);
        },

        multiply: function(n1, n2) {
            return n1 * n2;
        }


    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;