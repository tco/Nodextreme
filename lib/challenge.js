var fs = require('fs'),
    _ = require('underscore'),
    $ = require('jquery'),
    request = require('request'),
    transparency = require('transparency'),
    Challenge = function(challenge) {
        _.extend(this, challenge);
    };
//var

_.extend(Challenge.prototype, {

    templateFile: "challenge.html",
    validatorFile: "validator.js",
    teams: {},

    request: function(team, callback, context, regression) {
        var challenge = this,
            requestObject = this.getRequestObject(team);

        request(requestObject, function (error, response, body) {

            if(!error) {
                var $deferred = $.Deferred();
                challenge.validate(team, body, response, $deferred);
                $deferred.always(function(success) {
                    if(!!context) {
                        callback.call(context, team, challenge, success, regression);
                    } else {
                        callback(team, challenge, success, regression);
                    }
                });
            } else {
                if(!!context) {
                    callback.call(context, team, challenge, false, regression);
                } else {
                    callback(team, challenge, false, regression);
                }
            }

        });
    },

    addTeamAttribute: function(team, name, value) {
        var teamAttributes = this.getTeamAttributes(team);
        teamAttributes[name] = value;
    },

    getTeamAttribute: function(team, name) {
        var teamAttributes = this.getTeamAttributes(team);
        return teamAttributes[name];
    },

    getTeamAttributes: function(team) {
        if(!this.teams[team.get('host')]) {
            this.teams[team.get('host')] = {};
        }
        return this.teams[team.get('host')];
    },

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

    generateURI: function(team, auth) {
        if(auth) {
            return "http://" + auth.username + ":" + auth.password + "@" + team.get('host') + ":" + team.get('port') + this.uriPart;
        } else {
            return "http://" + team.get('host') + ":" + team.get('port') + this.uriPart;
        }
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
                },
                method: {
                    html: function() {
                        return challenge.method;
                    }
                },
                checkFor: {
                    html: function() {
                        return challenge.checkFor;
                    }
                }
            },
            rendered = $('<div>').append( $(html).render(team, directives) ).html();

        return rendered;
    },

    checkHeaders: function(headers, encoding) {
        var passed = true;
        for(key in headers) {
            var value = headers[key];
            console.log(key, value);
            if(key.toLowerCase() == 'content-type') {
                console.log(value.toLowerCase().indexOf('text/plain') === -1);
                if(value.toLowerCase().indexOf(encoding) === -1) {
                    passed = false;
                }
            } else if(key.toLowerCase() == 'content-encoding') {
                if(value.toLowerCase() != 'utf8' && value.toLowerCase() != 'utf-8') {
                    passed = false;
                }
            }
        }
        console.log(passed);
        return passed;
    }

});

transparency.register($);

exports.ChallengeBase = Challenge;