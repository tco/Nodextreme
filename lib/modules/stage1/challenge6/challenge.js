var fs = require('fs'),
    $ = require('jquery'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 6',
        uriPart: '/convert',
        method: 'POST',
        templatePath: __dirname,

        getRequestObject: function(team) {
            this.addTeamAttribute(team, 'testId', Math.floor(Math.random() * 100));
            this.addTeamAttribute(team, 'testName', 'xmltojson-' + Math.floor(Math.random() * 100));
            this.addTeamAttribute(team, 'body', '<root><id>'+this.getTeamAttribute(team,'testId')+
                '</id><name>'+this.getTeamAttribute(team,'testName')+'</name></root>');

            return {
                uri: this.generateURI(team),
                method: this.method,
                body: this.getTeamAttribute(team,'body')
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
        },

        conditionsMatch: function(team, body, response) {
            body = body.replace(/\\"/mg,'\"').replace(/^.(\s+)?/, '').replace(/(\s+)?.$/, '');
            var $json;
            
            try {
                $json = $.parseJSON(body);
            } catch(exception) {
                return false;
            }

            return  $json &&
                    $json.length !== 0 &&
                    $json.root &&
                    $json.root.id == this.getTeamAttribute(team,'testId') &&
                    $json.root.name == this.getTeamAttribute(team,'testName') &&
                    response.headers['content-type'] == 'application/json' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;