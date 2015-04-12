(function() {
    "use strict";

    function photoService($http) {
        return {
            getTrendingPhotos: function (callback) {
                $http
                    .get("/api/photos")// replace this with trending photos URL [ .get("/api/photos?filter=trending") ]
                    .success(function(data) {
                        callback(data.photos);
                    })
                    .error(function() {
                        console.error("error: unable to GET /api/photos")
                    });
            },
            getPhotoById: function (photoId, callback) {
                $http
                    .get('./api/photos')
                    .success(function (data) {
                        if (data.photos[photoId]) {

                            callback(data.photos[photoId]);
                        } else {
                            callback({
                                error: [{
                                    name: "unknownPhotoId",
                                    desc: "Error: Cannot retrieve photo"
                                }]
                            });
                        }
                    })
                    .error(function () {
                        console.error("error: cannot GET /api/photos");
                    });
            },
            getAllPhotos: function (callback) {
                $http.get('./api/photos')
                    .success(function(data) {
                        callback(data.photos);
                    })
                    .error(function() {
                        console.log("error: cannot GET /api/photos");
                    })
            }
        }
    }

    angular
        .module("app")
        .factory("photoService", ["$http", photoService]);
})();