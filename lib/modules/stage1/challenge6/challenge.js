var fs = require('fs'),
    $ = require('jquery'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 6',
        uriPart: '/convert',
        method: 'POST',
        templatePath: __dirname,

        getRequestObject: function(team) {
            this.testId = Math.floor(Math.random() * 100);
            this.testName = 'xmltojson-' + Math.floor(Math.random() * 100);
            this.body = '<root><id>'+this.testId+'</id><name>'+this.testName+'</name></root>';

            return {
                uri: this.generateURI(team),
                method: this.method,
                body: this.body
            };
        },

        validate: function(body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(body, response));
        },

        conditionsMatch: function(body, response) {
            body = body.replace(/\\"/mg,'\"').replace(/^.(\s+)?/, '').replace(/(\s+)?.$/, '');
            var $json = $.parseJSON(body);

            return  $json &&
                    $json.length !== 0 &&
                    $json.root &&
                    $json.root.id == this.testId &&
                    $json.root.name == this.testName &&
                    response.headers['content-type'] == 'application/json' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;