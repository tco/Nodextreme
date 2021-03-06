/*
 *  WARNING, DO NOT EDIT: THIS IS AUTOGENERATED BY GRUNT!
 */
define("models", [
    'underscore',
    {%=models%}
], function(_) {
    "use strict";

    var models = {};

    _.each(arguments, function(value, key, list) {
        if(value !== _ && !value && value.prototype.name) {
            throw new Error('All models have to have a name!');
        }
        if(_ !== value) {
            models[value.prototype.name] = value;
        }
    });

    return {
        get: function(name) {
            if(name in models) {
                return models[name];
            }
        }
    };

});
