/**
 * Created by Jordan Lo Presti
 */



(function() {
    "use strict";

    /** Dashboard Controller
     *
     * @param $scope            -The dashboard model
     * @param photoService      -The photo service(makes calls to the Photo API)
     * @param $location         -Location service used to watch/observe and change URL in browser address bar
     */

    function dashboardController($scope, photoService, $location) {
        function init() {
            $scope.trendingPhotos = [];
            //Obtain the photos from the photo service
            photoService.getTrendingPhotos(function(photos) {
                //Assign the photos and their information to the scope
                $scope.trendingPhotos = photos;

            })
        }

        init()

        /**
         * getPhotoUrl()
         *
         * Obtain the full photo url.
         *
         * @param url  - The photo name and extension
         */
        $scope.getPhotoUrl = function(url) {
            return photoService.getPhotoUrl() + url;
        };

        /**
         * showPhoto()
         *
         * Change the url to display the game for the selected photo
         *
         * @param photo - The photo id
         */
        this.showPhoto = function(photo){
            $location.path('/photo/'+photo);
        };

        /**
         * showLeaderboard()
         *
         * Change the url to display the full leaderboard
         */
        this.showLeaderboard = function() {
            $location.path('/leaderboard');
        }
    }

    /**
     *  Initialise the Dashboard Controller with the specified dependencies.
     */
    angular
        .module("app")
        .controller("dashboardController", ["$scope",
            "photoService",
            "$location",
            dashboardController
        ]);
})();