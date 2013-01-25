var stat = require('node-static'),
    sockjs = require('sockjs'),
    fileServer = new stat.Server('./application'),
    http = require('http'),
    _ = require('underscore'),
    connections = {},
    Nodextreme = require('./lib/nodextreme.js').Nodextreme,
    bufferedRanking = null;


var socketChannel = sockjs.createServer(),
    broadcast = function(data) {
        _.each(connections, function(connection) {
            connection.write(data);
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

Nodextreme.onTeams('advance', function(team) {
    var connectionId = team.get('connectionId'),
        connection = connections[connectionId];
    connection.write(JSON.stringify({
        originalData: {
            action: 'advanced',
            context: 'challenger'
        }
    }));
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
    if(chunk.trim() == 'start') {
        Nodextreme.start();
        broadcast(JSON.stringify({
            originalData: {
                action: 'start',
                context: 'game'
            }
        }));
        console.log('Nodextreme Startup Live!');
    } else if(chunk.trim() == 'pause') {
        Nodextreme.pause();
    } else if(chunk.trim() == 'stop') {
        Nodextreme.stop();
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
