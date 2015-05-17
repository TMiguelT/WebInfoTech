(function() {
    "use strict";

    /** Photo Service
     *
     * This service performs CRUD actions to the Photo API.
     *
     * @param $http     - HTTP service
     * @param _         - Lodash JS helper
     */
    function photoService($http, _) {
        return {

            /**
             * getTrendingPhotos()
             *
             * Obtains the trending photos from the API
             */
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

            /**
             * getPhotoById
             *
             * Obtains photo information by the ID.
             *
             * @param photoId  - The photo ID.
             */
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

            /**
             * getAllPhotos
             *
             * Obtain all the photos.
             */
            getAllPhotos: function (callback) {
                $http.get('./api/photo/all', {cache: true})
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                        console.error("error: cannot GET /api/photos");
                    });
            },

            /**
             * getGeoToLocation
             *
             * Obtain the geo-data to a location
             *
             * @param coords    - The user's coordinates
             * @param photo_id  - The photo ID
             */
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

            /**
             * searchPhotos()
             *
             * Searches the photo on given parameters
             *
             *
             * @param orderBy       - Order by a certain category
             * @param searchBy      - Search from a given string
             * @param searchMode    - The search mode
             * @param rows          - The amount of rows of photos
             * @param photosPerPage - Photos to display per page
             * @param coords        - The user's coordinates
             */
            searchPhotos: function (orderBy,searchBy,searchMode,rows,photosPerPage,coords,callback) {

                  $http.post('./api/photolist/search', {cache: true, orderBy: orderBy, searchBy : searchBy, searchMode :searchMode,rows:rows, photosPerPage:photosPerPage, coords:coords})
                    .success(function(data) {
                        // console.log(data);
                        callback(data);
                    })
                    .error(function() {
                        console.log("error: cannot GET /api/photolist/search");
                    });
            },

            /**
             * postComment()
             *
             * Post a comment to a photo
             *
             * @param comment - The comment object
             */
            postComment: function(comment) {
                $http.post('./api/photo/comment/add', comment)
                    .success(function(data) {
                        //console.log(data);
                    });
            },

            /**
             * deleteDomment()
             *
             * Delete a comment from a photo
             *
             * @param comment - The comment object
             */
            deleteComment: function(comment) {
                $http.post('./api/photo/comment/delete', comment)
                    .success(function(data) {
                        //console.log(data);
                    });
            },

            /**
             * addLike()
             *
             * Add a like to the photo
             *
             * @param user_id   - User ID of the user
             * @param photo_id  - Photo ID of the photo
             * @param value     - Like or dislike
             */
            addLike: function(user_id, photo_id, value) {
                var like = {
                    photo_id: photo_id,
                    user_id: user_id,
                    value: value
                };

                $http.post('./api/photo/like/add', like)
                    .success(function(data) {
                        //console.log(data);
                    });
            },

            /**
             * removeLike()
             *
             * Remove a like from the photo
             *
             * @param user_id   - User ID of the user
             * @param photo_id  - Photo ID of the photo
             * @param value     - Like or dislike
             */
            removeLike: function(user_id, photo_id, value) {
                var like = {
                    photo_id: photo_id,
                    user_id: user_id,
                    value: value
                };

                $http.post('./api/photo/like/delete', like)
                    .success(function(data) {
                        //console.log(data);
                    });
            },

            /**
             * getPhotoLikes()
             *
             * Obtain the likes of a particular photo
             *
             * @param photo         - The photo object
             * @param likeValue     - Like or dislike (1 or -1)
             */
            getPhotoLikes: function(photo, likeValue) {
                var likes = 0;

                // For each like, if the like is equal to the like or dislike value,
                // then add it to the like sum.
                _.forEach(photo.likes, function(like) {
                    if (like.value === likeValue)
                        likes++;
                });

                return likes;
            },

            /**
             * addFind()
             *
             * Add a find to the photo
             *
             * @param user_id       - The user's ID
             * @param photo_id      - The photo's ID
             * @param date          - The current date
             */
            addFind: function(user_id, photo_id, date) {
                var find = {
                    user_id: user_id,
                    photo_id: photo_id,
                    date: date
                };

                $http.post('./api/photo/find/add', find)
                    .success(function(data) {
                        //console.log(data);
                    });
            },

            /**
             * getPhotoUrl()
             *
             * Returns the URL of the VPS
             */
            getPhotoUrl: function() {
                return 'http://192.241.210.241/photos/';
            }
        }
    }

    angular
        .module("app")
        .factory("photoService", ["$http", "lodash", photoService]);
})();