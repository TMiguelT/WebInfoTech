(function () {
    "use strict";

    function gameService($http) {
        return {
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