(function() {
    "use strict";

    function aboutController($scope, photoService, scrollService) {
        function init() {
            photoService.getTrendingPhotos(function(photos) {
                $scope.trendingPhotos = photos;
            })
        }

        init()

        $scope.goTo = function(elName) {
            scrollService.goTo(elName)
        };
    }

    angular
        .module("app")
        .controller("aboutController", ["$scope",
                                        "photoService",
                                        "scrollService",
                                        aboutController
                                        ]);
})();
