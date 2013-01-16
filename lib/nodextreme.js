var os = require('os'),
    _ = require('underscore'),
    _str = require('underscore.string'),
    NodextremeTeams = require('./teams.js').NodextremeTeams,
    NodextremeModules = require('./modules/modules.js').NodextremeModules,
    Nodextreme = {

        status: {
            ERROR: 'ERROR',
            SUCCESS: 'SUCCESS'
        },

        getIP: function(iface) {

            var ifaces = os.networkInterfaces(),
                found = undefined;

            for (var dev in ifaces) {
                ifaces[dev].forEach(function(details) {
                    if (details.family=='IPv4') {
                        if(dev == iface) {
                            found = details.address;
                        }
                    }
                });
            }
            return found;
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



        processRegister: function(data, connection) {

            if(Nodextreme.register(data.parameters.teamName, data.parameters.port, connection.remoteAddress)) {
                return Nodextreme.success("Regisration successful", data);
            }
            return Nodextreme.success("Already registered", data);

        },
        register: function(name, port, host) {
            return NodextremeTeams.add(name, port, host);
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
                challenge = NodextremeModules.get(team.get('stage'), team.get('challenge'));
                body = challenge.renderChallengeBody(team);
                finished = false;
            }

            return {
                challenge: challenge,
                body: body,
                finished: finished
            };

        },

        processTest: function(data, connection) {
            var team = NodextremeTeams.get(connection.remoteAddress),
                challenge = NodextremeModules.get(team.get('stage'), team.get('challenge'));
            Nodextreme.test(team, challenge, connection, data);
        },
        test: function(team, challenge, connection, data) {
            challenge.validate(team, connection, data);
        },



        onTeams: function(action, listener) {
            NodextremeTeams.registerListener(action, listener);
        },
        getRanking: function() {
            return NodextremeTeams.getRanking();
        }

    };

exports.Nodextreme = Nodextreme;





