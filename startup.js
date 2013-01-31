var restify = require('restify'),
    request = require('request'),
    $ = require('jquery'),
    _ = require('underscore'),
    xml2js = require('xml2js');

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

server.get('/chess', function (request, response, next) {
    response.setHeader('content-type', 'text/plain');
    response.setHeader('content-encoding', 'utf-8');
    
    response.send('f6,e4,d2,f3');
    
    return next();
});

server.get('/calc/:method/:n1/:n2', function (request, response, next) {
    response.setHeader('content-type', 'text/plain');
    response.setHeader('content-encoding', 'utf-8');

    var v1 = parseInt(request.params.n1,10),
        v2 = parseInt(request.params.n2,10),
        method = request.params.method;

    if(v1 && v2) {
        if(method === 'reduce') {
            response.send((v1 - v2).toString());
        } else if(method === 'division') {
            response.send(Math.floor(v1 / v2).toString());
        } else if(method === 'multiply') {
            response.send((v1 * v2).toString());
        } else {
            response.send((v1 + v2).toString());
        }
    } else {
        response.send("false");
    }
    return next();
});

server.post('/convert', function (request, response, next) {
    response.setHeader('content-type', 'application/json');
    response.setHeader('content-encoding', 'utf-8');

    var parser = new xml2js.Parser({explicitArray: false});
    parser.parseString(request.body, function(err, result) {
        if(!err) {
            response.send(JSON.stringify(result));
        }
    });
});

server.get('shift', function(request, response, next) {
    response.setHeader('content-type', 'text/plain');
    response.setHeader('content-encoding', 'utf-8');
    console.log(request.params);
    var hash = request.params.hash,
        index = request.params.index,
        shiftHash = function(guid, index) {
            var characters = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
            return guid.replace(/[^-]/g, function(character) {
                var characterIndex = character.charCodeAt(0),
                    arrayIndex = characters.indexOf(character),
                    newIndex = parseInt(arrayIndex, 10) + parseInt(index, 10);
                if(newIndex > 35) {
                    newIndex = newIndex - 35;
                }
                return characters[newIndex];
            });
        },
        guid = shiftHash(hash, index);


    response.send(guid);

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
