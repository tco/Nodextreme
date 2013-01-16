var stat = require('node-static'),
    sockjs = require('sockjs'),
    fileServer = new stat.Server('./application'),
    http = require('http'),
    Nodextreme = require('./lib/nodextreme.js').Nodextreme;


var socketChannel = sockjs.createServer();

socketChannel.on('connection', function(connection) {
    connection.on('data', function(data) {
        var parsed = JSON.parse(data);
        Nodextreme.process(parsed, connection);
    });
    connection.on('close', function() {});
});

Nodextreme.onTeams('change', function() {
    console.log(Nodextreme.getRanking());
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

primaryServer.listen(8080);

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
