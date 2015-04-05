(function() {
    "use strict";

    function gameController($scope, gameService, scrollService, $routeParams) {
        setHeight();

        gameService.getPhotoById($routeParams.photoId - 1, function(photo) {
            $scope.photo = photo;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.map = getMap(position.coords);

                    $scope.position = {
                        coords: position.coords,
                        distance: getDistanceToLocation(position.coords, photo.location.coords),
                        direction: getDirection(position.coords, photo.location.coords)
                    };

                    $scope.$apply();
                });
            }
        });

        $scope.viewPhoto = function() {
            $('#viewPhoto').modal('show')
        }

        $scope.goTo = function(elName) {
            scrollService.goTo(elName);
        }

        function setHeight() {
            if ($(".photo-description").height() < 720) {
                $(".photo-description").css("height", "730px");
                $(".game").css("height", "730px");
            } else {
                $(".photo-description").css("height", "100%");
                $(".game").css("height", "100%");
            }
        }

        function radians(num) {
            return num * (Math.PI / 180);
        }

        function getMap(posCoords) {
            return {
                    center:
                        {
                            latitude: posCoords.latitude,
                            longitude: posCoords.longitude
                        },
                        zoom: 17,
                        options:
                        {
                            streetViewControl: false,
                            mapTypeControl: false,
                            panControl: false
                        }
                    };
        }

        function getDirection(posCoords, photoCoords) {
            var interval = 45;
            var point1 = new google.maps.LatLng(posCoords.latitude, posCoords.longitude);
            var point2 = new google.maps.LatLng(photoCoords.latitude, photoCoords.longitude);
            var heading = google.maps.geometry.spherical.computeHeading(point1,point2);

            if (heading < -(interval / 2) - (3 * interval)
                || heading > (interval / 2) + (3 * interval)) return "North";
            else if (heading < -(interval / 2) - (2 * interval)) return "North East";
            else if (heading < -(interval / 2) - interval) return "East";
            else if (heading < -(interval / 2)) return "South East";
            else if (heading < interval / 2) return "South";
            else if (heading < (interval / 2) + interval) return "South West";
            else if (heading < (interval / 2) + (2 * interval)) return "West";
            else if (heading < (interval / 2) + (3 * interval)) return "North West";
        }

        function getDistanceToLocation(posCoords, photoCoords) {
            var R = 6371; // metres
            var lat1_rad = radians(posCoords.latitude);
            var lat2_rad = radians(photoCoords.latitude);
            var diff_lat_rad = radians(photoCoords.latitude - posCoords.latitude);
            var diff_lon_rad = radians(photoCoords.longitude - posCoords.longitude);

            var a = Math.sin(diff_lat_rad/2) * Math.sin(diff_lat_rad/2) +
                Math.cos(lat1_rad) * Math.cos(lat2_rad) *
                Math.sin(diff_lon_rad/2) * Math.sin(diff_lon_rad/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            return R * c;
        }
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "gameService",
                                        "scrollService",
                                        "$routeParams",
                                        gameController]);
})();