(function() {
    "use strict";

    function photoService($http) {
        return {
            getTrendingPhotos: function (callback) {
                $http
                    .get("/api/photo/all")// replace this with trending photos URL [ .get("/api/photos/trending") ]
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                        console.error("error: unable to GET /api/photos")
                    });
            },
            getPhotoById: function (photoId, callback) {
                $http
                    .get('./api/photo/' + photoId, {cache: true})
                    .success(function (photo) {
                        if (photo.error) {
                            callback({
                                error: [{
                                    name: "unknownPhotoId",
                                    desc: "Error: Cannot retrieve photo"
                                }]
                            });
                        } else {
                            callback(photo);
                        }
                    })
                    .error(function () {
                        console.error("error: cannot GET /api/photos");
                    });
            },
            getAllPhotos: function (callback) {
                $http.get('./api/photo/all', {cache: true})
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                        console.log("error: cannot GET /api/photos");
                    });
            },
            postComment: function(comment) {
                $http.post('./api/photo/comment/add', comment)
                    .success(function(data) {
                        console.log(data);
                    });
            },
            deleteComment: function(comment) {
                $http.post('./api/photo/comment/delete', comment)
                    .success(function(data) {
                        console.log(data);
                    })
            },
            getPhotoUrl: function() {
                return 'http://192.241.210.241/photos/';
            }
        }
    }

    angular
        .module("app")
        .factory("photoService", ["$http", photoService]);
})();