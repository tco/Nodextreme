var _ = require('underscore'),
    _str = require('underscore.string'),
    NodextremeTeams = require('./teams.js').NodextremeTeams,
    NodextremeModules = require('./modules/modules.js').NodextremeModules,
    Nodextreme = {

        started: false,

        status: {
            ERROR: 'ERROR',
            SUCCESS: 'SUCCESS'
        },

        start: function() {
            Nodextreme.started = true;
            NodextremeTeams.startAll();
        },

        stop: function() {
            Nodextreme.started = false;
            NodextremeTeams.stopAll();
        },

        process: function(data, connection) {

            var process = "process" + _str.capitalize(data.action);

            if(typeof(Nodextreme[process]) === 'function') {
                var processed = Nodextreme[process](data, connection);
                if(processed) {
                    connection.write(JSON.stringify(processed));
                }
            } else {
                connection.write(JSON.stringify(Nodextreme.error("Missing processor for action: " + data.action, data.context)));
            }

        },



        error: function(message) {
            return Nodextreme.getError(message);
        },
        getError: function(message) {
            return {
                status: Nodextreme.status.ERROR,
                message: message
            };
        },



        success: function(message, data) {
            return Nodextreme.getSuccess(message, data);
        },
        getSuccess: function(message, data) {
            return {
                status: Nodextreme.status.SUCCESS,
                message: message,
                originalData: data
            };
        },


        processState: function(data, connection) {
            var team = NodextremeTeams.get(connection.remoteAddress);
            if(team !== undefined) {
                team.set('connectionId', connection.id);
                return {
                    status: Nodextreme.status.SUCCESS,
                    originalData: {
                        action: 'state',
                        context: 'startup',
                        challenges: team.get('regression')
                    }
                };
            } else {
                return {
                    status: Nodextreme.status.ERROR,
                    originalData: {
                        action: 'state',
                        context: 'startup'
                    }
                };
            }
        },


        processRegister: function(data, connection) {

            if(Nodextreme.register(data.parameters.teamName, data.parameters.port, connection.remoteAddress, connection.id)) {
                return Nodextreme.success("Regisration successful", data);
            }
            return Nodextreme.success("Already registered", data);

        },
        register: function(name, port, host, connectionId) {
            return NodextremeTeams.add(name, port, host, connectionId);
        },



        processChallenge: function(data, connection) {
            var team = NodextremeTeams.get(connection.remoteAddress),
                proxy = Nodextreme.challenge(team);

            data.challenge = {
                name: proxy.challenge.name,
                body: proxy.body,
                finished: proxy.finished
            };

            return Nodextreme.success("Challenge loaded", data);
        },
        challenge: function(team) {
            var challenge, body, finished;
            if(team.get('finished')) {
                challenge = {
                    name: 'Congratulations!'
                };
                body = "You made it!";
                finished = true;
            } else {
                challenge = NodextremeModules.getChallenge(team.get('stage'), team.get('challenge'));
                body = challenge.renderChallengeBody(team);
                finished = false;
            }

            return {
                challenge: challenge,
                body: body,
                finished: finished
            };

        },


        onTeams: function(action, listener) {
            NodextremeTeams.registerListener(action, listener);
        },

        getRanking: function() {
            return JSON.stringify({
                originalData: {
                    action: 'update',
                    context: 'ranking',
                    data: NodextremeTeams.getRanking()
                }
            });
        },

        isStarted: function() {
            return Nodextreme.started;
        }

    };

exports.Nodextreme = Nodextreme;





