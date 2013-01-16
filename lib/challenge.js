var fs = require('fs'),
    _ = require('underscore'),
    $ = require('jquery'),
    transparency = require('transparency'),
    Challenge = function(challenge) {
        _.extend(this, challenge);
    };
//var

_.extend(Challenge.prototype, {

    templateFile: "challenge.html",
    validatorFile: "validator.js",

    success: function(team, data) {
        team.advance();
        return JSON.stringify({
            success: true,
            originalData: data
        });
    },

    failure: function(team, data) {
        team.fail();
        return JSON.stringify({
            success: false,
            originalData: data,
            failures: team.get('failures')
        });

    },

    generateURI: function(team) {
        return "http://" + team.get('host') + ":" + team.get('port') + this.uriPart;
    },

    getChallengeHTML: function() {
        if(this.html) {
            return this.html;
        } else {
            var html = fs.readFileSync(this.templatePath + "/" + this.templateFile).toString('utf-8');
            this.html = html;
            return html;
        }
    },

    renderChallengeBody: function(team) {
        var challenge = this,
            html = this.getChallengeHTML(),
            directives = {
                host: {
                    html: function() {
                        return this.get('host');
                    }
                },
                port: {
                    html: function() {
                        return this.get('port');
                    }
                },
                uriPart: {
                    html: function() {
                        return challenge.uriPart;
                    }
                }
            },
            rendered = $('<div>').append( $(html).render(team, directives) ).html();

        return rendered;
    }

});

transparency.register($);

exports.ChallengeBase = Challenge;