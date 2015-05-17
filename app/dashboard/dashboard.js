(function() {
    "use strict";

    function dashboardController($scope, photoService, scrollService) {
        function init() {
            $scope.trendingPhotos = [];
            photoService.getTrendingPhotos(function(photos) {
                $scope.trendingPhotos = photos;
            })
        }

        init()

        $scope.goTo = function(elName) {
            scrollService.goTo(elName)
        };

        $scope.getPhotoUrl = function(url) {
            return photoService.getPhotoUrl() + url;
        };
    }

    angular
        .module("app")
        .controller("dashboardController", ["$scope",
            "photoService",
            "scrollService",
            dashboardController
        ]);
})();