(function() {
    "use strict";

    function gameController($scope, $routeParams) {
        $scope.photoId = $routeParams.photoId;
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "$routeParams",
                                        gameController]);
})();