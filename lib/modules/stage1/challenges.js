var _ = require('underscore'),
    challenges = [
        '/challenge1/challenge.js',
        '/challenge2/challenge.js',
        '/challenge3/challenge.js'
    ],
    Stage = {

        challenges: [],

        getAt: function(index) {
            return Stage.challenges[index-1];
        },

        isLastChallenge: function(index) {
            return index === Stage.challenges.length;
        }

    };
//var

_.each(challenges, function(modulePath, index) {
    var challenge = require(__dirname + modulePath).challenge;
    challenge.index = index + 1;
    challenge.getChallengeHTML();
    Stage.challenges.push(challenge);
});


exports.Stage = Stage;