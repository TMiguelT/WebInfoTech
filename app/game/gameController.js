(function() {
    "use strict";

    function gameController($scope, $routeParams) {
        $scope.photoId = $routeParams.photoId;

        $scope.map = { center: { latitude: 40, longitude: -73 }, zoom: 8 };
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "$routeParams",
                                        gameController]);
})();