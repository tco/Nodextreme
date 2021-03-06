define("config", function() {
    "use strict";

    var CI = 'http://nnn.nnn.nnn.nnn:xxxx',
        QA = 'http://nnn.nnn.nnn.nnn:xxxx',
        PR = 'http://nnn.nnn.nnn.nnn:xxxx',
        LOCALHOST =  'http://127.0.0.1:8080';

    var config = {
        DEBUG: false,
        DEBUG_EM: false,
        EVENTS: false,
        AJAXCACHE: false,
        HOST: LOCALHOST,
        SET_IMMEDIATE: true,
        TEMPLATE_STORAGE_PATH: 'templates/all.html',
        PATHS: {
            // JSONP path
            //DATA: '/data.json?callback=?',
            // JSON path
            DATA: '/data.json'
        }
    };

    return config;
});
