var stat = require('node-static'),
    sockjs = require('sockjs'),
    fileServer = new stat.Server('./application'),
    http = require('http'),
    _ = require('underscore'),
    connections = {},
    Nodextreme = require('./lib/nodextreme.js').Nodextreme,
    bufferedRanking = null;


var socketChannel = sockjs.createServer(),
    broadcast = function(data, teamConnection) {
        _.each(connections, function(connection) {
            if(!teamConnection || (teamConnection && connection !== teamConnection)) {
                connection.write(data);
            }
        });
    };

socketChannel.on('connection', function(connection) {
    connections[connection.id] = connection;
    connection.on('data', function(data) {
        var parsed = JSON.parse(data);
        Nodextreme.process(parsed, connection);
    });
    connection.on('close', function() {
        delete connections[connection.id];
    });
});

Nodextreme.onTeams('change', function() {
    clearTimeout(bufferedRanking);
    bufferedRanking = setTimeout(function() {
        broadcast(Nodextreme.getRanking());
    }, 100);
});

Nodextreme.onTeams('advance', function(team, challenge, finished) {
    var connectionId = team.get('connectionId'),
        connection = connections[connectionId];

    if(connection) {
        connection.write(JSON.stringify({
            originalData: {
                action: 'advanced',
                context: 'challenger'
            }
        }));
    } else {
        console.log("no connection found for team:",team.get('name'));
    }

    // Send notification to all teams that this one has advanced
    broadcast(JSON.stringify({
        originalData: {
            message: !finished ? team.get('name') + ' advanced ' + challenge.name : team.get('name') + ' finished the eXtreme startup, Congratz',
            action: 'message',
            context: 'toaster'
        }
    }),connection);

    if(finished) {
        Nodextreme.stop();
    }
});

Nodextreme.onTeams('challenges', function(team) {
    var connectionId = team.get('connectionId'),
        connection = connections[connectionId];

    if(connection) {
        connection.write(JSON.stringify({
            originalData: {
                action: 'challenges',
                challenges: team.get('challenges'),
                context: 'challenger'
            }
        }));
    } else {
        console.log("no connection found for team:",team.get('name'));
    }

});

var primaryServer = http.createServer(function (request, response) {
    if(request.method === "GET") {
        request.addListener('end', function () {
            fileServer.serve(request, response, function (e, res) {
                if (e && (e.status === 404)) { // If the file wasn't found
                    fileServer.serveFile('/index.html', 200, {}, request, response);
                }
            });
        });
    }

});

socketChannel.installHandlers(primaryServer, { prefix: '/SocketChannel' });

primaryServer.listen(8888);

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    var words = chunk.trim().split(" "),
        command = words.shift();

    if(command == 'start') {
        Nodextreme.start();
        broadcast(JSON.stringify({
            originalData: {
                action: 'start',
                context: 'game'
            }
        }));
        console.log('Nodextreme Startup Live!');
    } else if(command == 'stop') {
        Nodextreme.stop();
        broadcast(JSON.stringify({
            originalData: {
                action: 'stop',
                context: 'game'
            }
        }));
        console.log('Nodextreme Startup Stopped!');
    } else if(command == 'broadcast') {
        console.log("broadcasting", words.join(" "));
        broadcast(JSON.stringify({
            originalData: {
                action: 'message',
                context: 'toaster',
                message: words.join(" ")
            }
        }));
    }
});

/*process.stdin.on('end', function () {
    process.stdout.write('end');
});*/

/*var release = new stat.Server('./release');

require('http').createServer(function (request, response) {

    if(request.method === "GET") {
        request.addListener('end', function () {
            release.serve(request, response, function (e, res) {
                if (e && (e.status === 404)) { // If the file wasn't found
                    release.serveFile('/index.html', 200, {}, request, response);
                }
            });
        });
    }

}).listen(8090);*/
