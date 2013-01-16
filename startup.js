var restify = require('restify'),
    request = require('request'),
    _ = require('underscore'),
    NodextremeModules = require('./lib/modules/modules.js').NodextremeModules;

var server = restify.createServer({
    name: 'Nodextreme Server',
    version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


_.each(NodextremeModules.stages, function(stage) {
    _.each(stage.challenges, function(challenge) {


        server[challenge.method](challenge.uriPart, function(request, response, next) {
            challenge.test(response);
            return next();
        });
        console.log(challenge.method.toLowerCase());
    });
});


/*server.get('/register', function (request, response, next) {
    var name = request.params.name,
        host = request.headers.host;

    if(!name !== "") {
        if(!Nodextreme.registered(name, host)) {
            Nodextreme.register(name, host);
        } else {
            response.send(Nodextreme.error("Registration failed: already registered!"));
        }

    } else {
        response.send(Nodextreme.error("Registering failed: missing or empty mandatory property: name"));
    }
    return next();
});

server.get('/challenge/:id', function (requets, response, next) {

    return next();
});

server.post('/answer/:id', function(request, response, next) {

    return next();
});*/

server.listen(9999, function () {
    console.log('%s listening at %s', server.name, server.url);
});