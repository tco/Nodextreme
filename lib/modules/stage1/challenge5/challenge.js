var fs = require('fs'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 5',
        uriPath: '/calc/',
        method: 'GET',
        templatePath: __dirname,

        getRequestObject: function(team) {
            this.addTeamAttribute(team, 'c5_n1', Math.floor(Math.random() * 100));
            this.addTeamAttribute(team, 'c5_n2', Math.floor(Math.random() * 100));
            this.addTeamAttribute(team, 'c5_method', this.getRandomMethod());

            this.uriPart = this.uriPath + this.getTeamAttribute(team, 'c5_method') + '/' +
                this.getTeamAttribute(team, 'c5_n1') + '/' +
                this.getTeamAttribute(team, 'c5_n2');

            var answer = this[this.getTeamAttribute(team, 'c5_method')](this.getTeamAttribute(team, 'c5_n1'), this.getTeamAttribute(team, 'c5_n2'));
            this.addTeamAttribute(team, 'c5_answer', answer);

            return {
                uri: this.generateURI(team),
                method: this.method
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
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

        conditionsMatch: function(team, body, response) {
            return  body.trim() == this.getTeamAttribute(team, 'c5_answer') &&
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