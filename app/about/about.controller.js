(function() {
    "use strict";

    /** About Controller 
    *
    * The main controller for the about page section.
    * Mainly deals with the displaying the trending photos carousel. 
    *
    * @param $scope         - The about model
    * @param photoService   - The photo service (makes calls to the Photo API)
    * @param scrollService  - The scroll service (used for JS scrolling)
    */
    function aboutController($scope, photoService, scrollService) {
        function init() {
            $scope.trendingPhotos = [];
            //Obtains the photos from the photo service
            photoService.getTrendingPhotos(function(photos) {
                //Assign the photos and their information to the scope
                $scope.trendingPhotos = photos;
            })
        }

        init()

        $scope.goTo = function(elName) {
            scrollService.goTo(elName)
        };
    }
    /**
    * Initialise the about controller with the specific dependencies
    */
    angular
        .module("app")
        .controller("aboutController", ["$scope",
                                        "photoService",
                                        "scrollService",
                                        aboutController
                                        ]);
})();
