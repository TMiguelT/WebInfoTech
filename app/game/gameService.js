(function() {
    "use strict";

    function gameService($http) {
        return {
            getPhotoById: function(photoId, callback) {
                $http
                    .get('./api/photos')
                    .success(function(data) {
                        callback(data.photos[photoId]);

                    })
                    .error(function() {
                        console.error("error: cannot GET /api/photos");
                    });
            }
        }
    }

    angular
        .module("app")
        .factory("gameService", ["$http",
                                gameService
                                ]
        );
})();