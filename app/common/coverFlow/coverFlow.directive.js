(function() {
    "use strict";

    function photoCarousel() {
        return {
            restrict: "E",
            scope: {
                photos: "=photos"
            },
            templateUrl: "/public/common/coverFlow/coverFlow.html"
        }
    }

    angular
        .module("app")
        .directive("photoCarousel", photoCarousel);
})();
