//Utility functions for working with photo URLs

//Requires
var url = require('url');

//Constants
var BASE_URL = "http://192.241.210.241/photos/";

exports.baseUrl = BASE_URL;
exports.fullUrl = function (photo_url) {
    return url.resolve(BASE_URL, photo_url);
};