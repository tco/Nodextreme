var _ = require('underscore'),
    stages = [
        '/stage1/challenges.js'
        //'/stage2/stage2.js',
        //'/stage3/stage3.js'
    ],
    NodextremeModules = {

        stages: {},

        get: function(stage, challenge) {
            return NodextremeModules.getStage(stage).getAt(challenge);
        },

        getStage: function(stage) {
            return NodextremeModules.stages["stage" + stage];
        },

        isLastStage: function(stage) {
            return stage === stages.length;
        },

        isLastChallenge: function(stage, challenge) {
            return NodextremeModules.isLastStage(stage) && NodextremeModules.getStage(stage).isLastChallenge(challenge);
        }

    };
//var

_.each(stages, function(modulePath, index) {
    var stage = require(__dirname + modulePath).Stage;
    stage.index = index + 1;
    NodextremeModules.stages["stage" + stage.index] = stage;
});


exports.NodextremeModules = NodextremeModules;