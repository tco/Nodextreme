/*
 *  WARNING, DO NOT EDIT: THIS IS AUTOGENERATED BY GRUNT!
 */
define("collections", [
    'underscore',
    "collections/datas"
], function(_) {
    "use strict";
    var collections = {};

    _.each(arguments, function(value, key, list) {
        if(value !== _ && !value && value.prototype.name) {
            throw new Error('All collections have to have a name!');
        }
        if(_ !== value) {
            collections[value.prototype.name] = value;
        }
    });

    return {
        get: function(name) {
            if(name in collections) {
                return collections[name];
            }
        }
    };
});
