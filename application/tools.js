/*
 *  WARNING, DO NOT EDIT: THIS IS AUTOGENERATED BY GRUNT!
 *  Tools are singletons to be shared among modules
 */
define('tools', [
    'underscore',
    "tools/eventmachine",
    "tools/polyfills",
    "tools/templatestorage",
    "tools/urls"
], function(_) {
    "use strict";

    var key, tools = {};

    _.each(arguments, function(value, key, list) {
        if(value && value.name) {
            tools[value.name] = value;
        }
    });

    return tools;

});
