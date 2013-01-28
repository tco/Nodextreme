var jam = {
    "packages": [
        {
            "name": "backbone",
            "location": "jam/backbone",
            "main": "backbone.js"
        },
        {
            "name": "bootstrap",
            "location": "jam/bootstrap"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "highcharts",
            "location": "jam/highcharts",
            "main": "highcharts.src.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "keymaster",
            "location": "jam/keymaster",
            "main": "keymaster.js"
        },
        {
            "name": "less",
            "location": "jam/less",
            "main": "./lib/less/index"
        },
        {
            "name": "transparency",
            "location": "jam/transparency",
            "main": "lib/transparency"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        },
        {
            "name": "underscore.string",
            "location": "jam/underscore.string",
            "main": "./lib/underscore.string"
        }
    ],
    "version": "0.2.11",
    "shim": {
        "backbone": {
            "deps": [
                "jquery",
                "underscore"
            ],
            "exports": "Backbone"
        },
        "highcharts": {
            "exports": "Highcharts"
        },
        "keymaster": {
            "exports": "key"
        },
        "underscore": {
            "exports": "_"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}