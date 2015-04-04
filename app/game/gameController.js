(function() {
    "use strict";

    function gameController($scope, gameService, $routeParams, $http) {
        gameService.getPhotoById($routeParams.photoId - 1, function(photo) {
            $scope.photo = photo;
            $scope.map = { center: { latitude: photo.location.coords.latitude, longitude: photo.location.coords.longitude }, zoom: 17 };
        });

        $scope.goToGame = function() {
            $('html, body').animate({
                scrollTop: $('.game').offset().top
            },500);
        };

        $scope.viewPhoto = function() {
            $('#viewPhoto').modal('show')
        }

        setHeight();

        function setHeight() {
            if ($(".photo-description").height() < 400) {
                $(".photo-description").css("height", "730px");
            } else {
                $(".photo-description").css("height", "100%");
            }
        }
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "gameService",
                                        "$routeParams",
                                        "$http",
                                        gameController]);
})();