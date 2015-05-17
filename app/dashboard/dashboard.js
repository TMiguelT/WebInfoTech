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

        this.showLeaderboard = function(){
            $location.path('/leaderboard');
        }


        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
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