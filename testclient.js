var request = require('request'),
    _ = require('underscore'),
    NodextremeModules = require('./modules/modules.js').NodextremeModules;

console.log(NodextremeModules);

request({
    method: 'POST',
    uri:'http://localhost:8080/register',
    json: { name: 'Team Ahma' }
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
});