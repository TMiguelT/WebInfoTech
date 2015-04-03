(function() {
    "use strict";

    function gameController($scope, $routeParams) {
        // mock data, will add this to a route l8er
        $scope.photo = {
            id: $routeParams.photoId,
            url: "flinders.jpg",
            title: "Flinders Street Station",
            description: "Flinders Street railway station is a railway station on the corner of Flinders and Swanston Streets in Melbourne, Australia. It serves the entire metropolitan rail network. Backing onto the city reach of the Yarra River in the heart of the city, the complex covers two whole city blocks and extends from Swanston Street to Queen Street.",
            location: {
                coords: {
                    latitude: -37.810144,
                    longitude: 144.962674
                }
                // could add altitude and orientation?
            },
            user: {
              name: "MikeHunt"
            },
            tags: [
                {
                    name: "Railway Station",
                    url: "/photo/tags/railway_station"
                },
                {
                    name: "Heritage",
                    url: "/photo/tags/heritage"
                },
                {
                    name: "Sexy",
                    url: "/photo/tags/sexy"
                }
            ],
            likes: 12,
            comments: [
                {
                    name: "MikeHunt",
                    date_posted: "4:01pm 25th August 2015",
                    post: "this is awesome lol"
                },
                {
                    name: "AlistairMoffat",
                    date_posted: "3:55pm 25th August 2015",
                    post: "2/10 wood bang"
                }
            ]
        };

        $scope.map = { center: { latitude: -37.810144, longitude: 144.962674 }, zoom: 17 };
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "$routeParams",
                                        gameController]);
})();