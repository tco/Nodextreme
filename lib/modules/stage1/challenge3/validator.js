var request = require('request'),
    $ = require('jquery');

request({
    uri: "https://www.google.com/search",
    qs: {
        q: "Pamela Anderson"
    }
}, function(error, response, body) {
    $stats = $(body).find("#resultStats");
    $stats.find("nobr").remove();
    var pamelas = parseInt($stats.text().replace(/[^\d]*/g, ""), 10);
    console.log(pamelas);
});