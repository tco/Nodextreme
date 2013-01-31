var fs = require('fs'),
    $ = require('jquery'),
    ChallengeBase = require('../../../challenge.js').ChallengeBase,
    challengeExtension = {
        name: 'Challenge 7',
        uriPart: '/shift',
        method: 'GET',
        templatePath: __dirname,

        GUID: 'c7_n1',
        INDEX: 'c7_n2',

        getRequestObject: function(team) {

            var guid = this.generateGUID(),
                index = Math.floor(Math.random() * 34) + 1;

            this.addTeamAttribute(team, this.GUID, guid);
            this.addTeamAttribute(team, this.INDEX, index);

            return {
                uri: this.generateURI(team),
                method: this.method,
                qs: {
                    hash: guid,
                    index: index
                }
            };
        },

        validate: function(team, body, response, $deferred) {
            $deferred.resolve(this.conditionsMatch(team, body, response));
        },

        generateGUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        getShiftedGUID: function(guid, index) {
            var characters = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
            return guid.replace(/[^-]/g, function(character) {
                var characterIndex = character.charCodeAt(0),
                    arrayIndex = characters.indexOf(character),
                    newIndex = parseInt(arrayIndex, 10) + parseInt(index, 10);
                if(newIndex > 35) {
                    newIndex = newIndex - 35;
                }
                return characters[newIndex];
            });
        },

        conditionsMatch: function(team, body, response) {
            body = body.toString().trim();
            var shifted = body,
                checkup = this.getShiftedGUID(this.getTeamAttribute(team, this.GUID), this.getTeamAttribute(team, this.INDEX));


            return  shifted === checkup &&
                    response.headers['content-type'] == 'text/plain' &&
                    response.headers['content-encoding'] == 'utf-8';
        }
    },
    challenge = new ChallengeBase(challengeExtension);
//var

exports.challenge = challenge;