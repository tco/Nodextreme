var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    connections = {},
    Nodextreme = require('./lib/nodextreme.js').Nodextreme,
    bufferedRanking = null;

/*app.configure(function() {
    //app.use(express.static(__dirname + '/application'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});*/

app.listen(8888);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/application/index.html');
});


var broadcast = function(data, teamConnection) {
        teamConnection.emit('message', data);
    };

io.set('loglevel', 10);

io.on('connection', function(connection) {
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
        console.log("no connection found for team", team.get('name'));
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
