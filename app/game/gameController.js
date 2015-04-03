(function() {
    "use strict";

    function gameController($scope, gameService, $routeParams, $http) {
        gameService.getPhotoById($routeParams.photoId - 1, function(photo) {
            $scope.photo = photo;
            $scope.map = { center: { latitude: photo.location.coords.latitude, longitude: photo.location.coords.longitude }, zoom: 17 };
        });
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "gameService",
                                        "$routeParams",
                                        "$http",
                                        gameController]);
})();