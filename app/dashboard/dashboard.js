(function() {
    "use strict";

    function dashboardController($scope, photoService, scrollService, $location) {
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

        this.showPhoto = function(photo){
            $location.path('/photo/'+photo);

        };
    }

    angular
        .module("app")
        .controller("dashboardController", ["$scope",
            "photoService",
            "scrollService",
            "$location",
            dashboardController
        ]);
})();