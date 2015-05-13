(function() {
    "use strict";

    function photoService($http, _) {
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
                        console.error("error: cannot GET /api/photos");
                    });
            },
            getGeoToLocation: function(coords, photo_id, callback) {
                $http
                    .post('./api/photo/distance', {
                        photo_id: photo_id,
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    })
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                        console.error("error: cannot POST /api/photo/distance");
                    })
            },
            searchPhotos: function (orderBy,searchBy,searchMode,callback) {

                  $http.post('./api/photolist/search', {cache: true, orderBy: orderBy, searchBy : searchBy, searchMode:searchMode})
                    .success(function(data) {
                        console.log(data);
                        callback(data);
                    })
                    .error(function() {
                        console.log("error: cannot GET /api/photolist/search");
                    });
            },

            postComment: function(comment) {
                $http.post('./api/photo/comment/add', comment)
                    .success(function(data) {
                        //console.log(data);
                    });
            },
            deleteComment: function(comment) {
                $http.post('./api/photo/comment/delete', comment)
                    .success(function(data) {
                        //console.log(data);
                    });
            },
            addLike: function(user_id, photo_id, value) {
                var like = {
                    photo_id: photo_id,
                    user_id: user_id,
                    value: value
                }

                $http.post('./api/photo/like/add', like)
                    .success(function(data) {
                        //console.log(data);
                    });
            },
            removeLike: function(user_id, photo_id, value) {
                var like = {
                    photo_id: photo_id,
                    user_id: user_id,
                    value: value
                }

                $http.post('./api/photo/like/delete', like)
                    .success(function(data) {
                        //console.log(data);
                    });
            },
            getPhotoLikes: function(photo, likeValue) {
                var likes = 0;

                _.forEach(photo.likes, function(like) {
                    if (like.value === likeValue)
                        likes++;
                });

                return likes;
            },
            getPhotoUrl: function() {
                return 'http://192.241.210.241/photos/';
            }
        }
    }

    angular
        .module("app")
        .factory("photoService", ["$http", "lodash", photoService]);
})();