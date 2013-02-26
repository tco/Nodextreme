var express = require('express');
var app = express();
var socket = require('socket.io');

var _ = require('underscore'),
    connections = {},
    Nodextreme = require('./lib/nodextreme.js').Nodextreme,
    bufferedRanking = null,
    bufferedChallenges = {},
    broadcast = function(data, socket) {
        io.sockets.emit('data', data);
    },
    rootHandler = function(request, response) {
        response.sendfile(__dirname + '/application/index.html');
    };



app.get('/welcome', rootHandler);
app.get('/startup', rootHandler);
app.get('/ranking', rootHandler);


app.configure(function(){
    app.use(express.static(__dirname + '/application'));
});

var server = app.listen(8080);
var io = socket.listen(server);

io.set('log level', 0);

io.sockets.on('connection', function (socket) {
    //socket.emit('connect');
    socket.on('data', function(data) {
        var parsed = JSON.parse(data);
        Nodextreme.process(parsed, socket);
    });
    socket.on('disconnect', function (socket) {
        console.log("disconnect");
    });
});

Nodextreme.onTeams('change', function() {
    clearTimeout(bufferedRanking);
    bufferedRanking = setTimeout(function() {
        broadcast(Nodextreme.getRanking());
    }, 100);
});

Nodextreme.onTeams('advance', function(team, challenge, finished) {
    var connection = team.get('connection');

    if(connection) {
        connection.emit('data', JSON.stringify({
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
    }), connection);

    if(finished) {
        Nodextreme.stop();
    }
});

Nodextreme.onTeams('challenges', function(team) {
    var connection = team.get('connection');

    if(connection) {
        clearTimeout(bufferedChallenges[connection.id]);
        bufferedChallenges[connection.id] = setTimeout(function() {
            connection.emit('data', JSON.stringify({
                originalData: {
                    action: 'challenges',
                    challenges: team.get('challenges'),
                    context: 'challenger'
                }
            }));
        }, 1000);
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