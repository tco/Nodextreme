var restify = require('restify'),
    request = require('request'),
    $ = require('jquery'),
    _ = require('underscore');

var server = restify.createServer({
    name: 'Nodextreme Server',
    version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


server.get('/hello', function (request, response, next) {
    response.setHeader('content-type', 'text/plain');
    response.setHeader('content-encoding', 'utf-8');
    if(request.params.text) {
        response.send(request.params.text);
    } else {
        response.send("World!");
    }
    return next();
});

server.get('/how/many/pamela', function (restifyRequest, restifyResponse, next) {
    request({
        uri: "https://www.google.com/search",
        qs: {
            q: "Pamela+Anderson"
        }
    }, function(error, response, body) {
        if(!error && response.statusCode == 200) {

            $stats = $(body).find("#resultStats");
            var pamelas = parseInt($stats.text().replace(/[^\d]*/g, ""), 10);

            restifyResponse.send(pamelas);
        }

    });
    return next();
});

server.listen(9999, function () {
    console.log('%s listening at %s', server.name, server.url);
});