(function() {
    "use strict";

    function gameController($scope, photoService, scrollService, userService, $routeParams, $rootScope) {

        $scope.getPhoto = function() {
            photoService.getPhotoById($routeParams.photoId, function(element) {
                $scope.photo = element.photo;

                $scope.hasUserLiked()
                $scope.photoLikes = photoService.getPhotoLikes($scope.photo, 1);
                $scope.photoDislikes = photoService.getPhotoLikes($scope.photo, -1);

                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.userLocation = position.coords;
                    $scope.map = getMap(position.coords);

                    $scope.position = {
                        coords: position.coords,
                        distance: getDistanceToLocation(position.coords, element.photo.location),
                        direction: getDirection(position.coords, element.photo.location)
                    };

                    $scope.photoRadius = {
                        center: getRandomRadiusCenter($scope.photo.location[1], $scope.photo.location[0], 100),
                        radius: 100,
                        stroke: {
                            color: '#0072ff',
                            weight: 2,
                            opacity: 1
                        },
                        fill: {
                            color: '#0072ff',
                            opacity: 0.2
                        }
                    }

                    $scope.photoLoaded = true;
                    $scope.$apply();
                }, function() {
                    var error = {
                        name: "navigatorError",
                        desc: "Cannot display map - please enable your location"
                    };
                    $scope.photo.error ? $scope.photo.error.push(error) : $scope.photo.error = [error];
                    $scope.$apply();
                });
            });
        }

        $scope.getPhotoUrl = function(url) {
            return photoService.getPhotoUrl() + url;
        };

        $scope.viewPhoto = function() {
            $('#viewPhoto').modal('show')
        };

        $scope.goTo = function(elName) {
            scrollService.goTo(elName);
        };

        $scope.showDescription = function() {
            $('.showDescription-button').css("display", "none");
            $('.furtherDescription').css("display", "block");
        }

        $scope.errorContains = function(errorName) {
            var errorFound = false;

            if (!$scope.photo || !$scope.photo.error ) return false;

            $scope.photo.error.forEach(function(error) {
                if (error.name == errorName) errorFound = true;
            });

            return errorFound;
        };

        $scope.displayError = function(errorName) {
            var errorMessage = false;

            if (!$scope.photo || !$scope.photo.error) return false;

            $scope.photo.error.forEach(function(error) {
                if (error.name == errorName) errorMessage = error.desc;
            });

            return errorMessage;
        };

        $scope.parseDate = function(date) {
            if (moment(date).isValid())
                return moment(date).format("Do MMMM YYYY, h:mm:ss a");
            else
                return date;
        };

        $scope.doesCommentBelongToUser = function(user_id) {
            return (user_id.toString() === $scope.userData.user_id);
        };

        $scope.userCannotLike = function() {
            return !$scope.userData.logged_in && $scope.likeError;
        }

        $scope.deleteComment = function(comment) {
            var photoComments = $scope.photo.comments;

            for (var i = 0; i < photoComments.length; i++) {
                if ((photoComments[i].date_posted == comment.date_posted) && (photoComments[i].user_id == comment.user_id)) {
                    $scope.photo.comments.splice(i, 1);
                }
            }

            photoService.deleteComment(comment)
        }

        $scope.submitComment = function(comment_text) {
            var dateTime = moment().format();

            var new_comment = {
                comment_content: {
                    date_posted: dateTime,
                    text: comment_text,
                    user_id: $scope.userData.user_id,
                    username: $scope.userData.username,
                },
                photo_id: $scope.photo.id
            }

            $scope.photo.comments.push(new_comment.comment_content);

            photoService.postComment(new_comment);

            $scope.comment_text = "";

        };

        $scope.addLike = function() {
            if ($scope.userData.logged_in && !$scope.userHasLiked) {
                if ($scope.userHasDisliked) {
                    removeDislike()
                }
                addLike()
            } else if ($scope.userData.logged_in && $scope.userHasLiked) {
                removeLike()
            } else if (!$scope.userData.logged_in) {
                $scope.likeError = true;
            }
        };

        $scope.addDislike = function() {
            if ($scope.userData.logged_in && !$scope.userHasDisliked) {
                if ($scope.userHasLiked) {
                    removeLike()
                }
                addDislike()
            } else if ($scope.userData.logged_in && $scope.userHasDisliked) {
                removeDislike()
            } else if (!$scope.userData.logged_in) {
                $scope.likeError = true;
            }
        };

        $scope.hasUserLiked = function() {
            _.forEach($scope.photo.likes, function(like) {
                if (like.user_id == $scope.userData.user_id) {
                    if (like.value === 1)
                        $scope.userHasLiked = true;
                    else
                        $scope.userHasDisliked = true;
                }
            });
        };

        $scope.changeMapCenter = function(centerType) {
            $scope.centerType = centerType;

            if (centerType === 'userLocation') {
                $scope.map.center = {
                    latitude: $scope.userLocation.latitude,
                    longitude: $scope.userLocation.longitude
                };
            } else {
                $scope.map.center = {
                    latitude: $scope.photoRadius.center.latitude,
                    longitude: $scope.photoRadius.center.longitude
                };
            }
        };

        $scope.tryAgain = function() {
            $scope.foundPhotoLoaded = false;
        }

        function init() {
            $scope.photoLoaded = false;
            $scope.userData = userService.data;
            $scope.photoLikes = 0;
            $scope.userHasLiked = false;
            $scope.photoDislikes = 0;
            $scope.userHasDisliked = false;
            $scope.centerType = 'userLocation';

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
                if (!$scope.userData.logged_in) {
                    $scope.userHasLiked = false;
                    $scope.userHasDisliked = false;
                }
            });
        }

        function addDislike() {
            $scope.photoDislikes++;
            $scope.userHasDisliked = true;
            photoService.addLike($scope.userData.user_id, $scope.photo.id, -1)
        }

        function addLike() {
            $scope.photoLikes++;
            $scope.userHasLiked = true;
            photoService.addLike($scope.userData.user_id, $scope.photo.id, 1)

        }

        function removeDislike() {
            $scope.photoDislikes--;
            $scope.userHasDisliked = false;
            photoService.removeLike($scope.userData.user_id, $scope.photo.id, -1)
        }

        function removeLike() {
            $scope.photoLikes--;
            $scope.userHasLiked = false;
            photoService.removeLike($scope.userData.user_id, $scope.photo.id, 1);
        }

        function setFoundPhotoButton() {
            var photoLocation = {
                orientation: {},
                coords: {}
            }
            $scope.isOrientationCapable = false;
            $scope.foundPhotoLoaded = false;
            $scope.photoFound = false;

            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(orientation){
                    if(orientation.alpha) {
                        $scope.isOrientationCapable = true;
                        photoLocation.orientation = orientation;
                    }
                });
            }

            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);

                navigator.geolocation.getCurrentPosition(function(position) {
                    photoLocation.coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    $scope.foundPhotoLoaded = true;

                    if (isLocationWithinRange(photoLocation))
                        $scope.photoFound = true;
                    else
                        $scope.photoFound = false;

                    $scope.$apply();
                });
            });
        }

        function setHeight() {
            if ($(".photo-description").height() < 720) {
                $(".photo-description").css("height", "730px");
            } else {
                $(".photo-description").css("height", "100%");
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

        function isLocationWithinRange(photoLocation) {
            if (photoLocation.coords.latitude < $scope.photo.location[1] - 0.0005 ||
                photoLocation.coords.latitude > $scope.photo.location[1] + 0.0005)
                return false;
            if (photoLocation.coords.longitude < $scope.photo.location[0] - 0.0005 ||
                photoLocation.coords.longitude > $scope.photo.location[0] + 0.0005)
                return false;
            return true;
        }

        function getDirection(posCoords, photoCoords) {
            var interval = 45;
            var point1 = new google.maps.LatLng(posCoords.latitude, posCoords.longitude);
            var point2 = new google.maps.LatLng(photoCoords[1], photoCoords[0]);
            var heading = google.maps.geometry.spherical.computeHeading(point1,point2);

            if (heading < -(interval / 2) - (3 * interval)
                || heading > (interval / 2) + (3 * interval)) return "South";
            else if (heading < -(interval / 2) - (2 * interval)) return "South West";
            else if (heading < -(interval / 2) - interval) return "West";
            else if (heading < -(interval / 2)) return "North West";
            else if (heading < interval / 2) return "North";
            else if (heading < (interval / 2) + interval) return "North East";
            else if (heading < (interval / 2) + (2 * interval)) return "East";
            else if (heading < (interval / 2) + (3 * interval)) return "South East";
        }

        function getDistanceToLocation(posCoords, photoCoords) {
            var R = 6371; // metres
            var lat1_rad = radians(posCoords.latitude);
            var lat2_rad = radians(photoCoords[1]);
            var diff_lat_rad = radians(photoCoords[1] - posCoords.latitude);
            var diff_lon_rad = radians(photoCoords[0] - posCoords.longitude);

            var a = Math.sin(diff_lat_rad/2) * Math.sin(diff_lat_rad/2) +
                Math.cos(lat1_rad) * Math.cos(lat2_rad) *
                Math.sin(diff_lon_rad/2) * Math.sin(diff_lon_rad/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            return R * c;
        }

        function getRandomRadiusCenter(latitude, longitude, radius) {
            var radiusInDegrees = radius / 111000.0;

            var u = Math.random();
            var v = Math.random();
            var w = radiusInDegrees * Math.sqrt(u);
            var t = 2 * Math.PI * v;
            var x = w * Math.cos(t);
            var y = w * Math.sin(t);

            var new_x = x / Math.cos(latitude)

            var foundLatitude = new_x + latitude;
            var foundLongitude = y + longitude;

            return {latitude: foundLatitude,
                        longitude: foundLongitude};
        }

        init();

        $('html, body').animate({ scrollTop: 0 }, 0);

        setFoundPhotoButton();

        setHeight();
    }

    angular
        .module("app")
        .controller("gameController", ["$scope",
                                        "photoService",
                                        "scrollService",
                                        "userService",
                                        "$routeParams",
                                        "$rootScope",
                                        gameController]);
})();