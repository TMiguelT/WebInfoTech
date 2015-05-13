(function() {
    "use strict";

    function gameController($scope, photoService, scrollService, userService, $routeParams, $rootScope) {

        $scope.getPhoto = function() {
            photoService.getPhotoById($routeParams.photoId, function(element) {
                $scope.photo = element.photo;

                $scope.hasUserLiked();
                $scope.hasUserFound();
                $scope.photoLikes = photoService.getPhotoLikes($scope.photo, 1);
                $scope.photoDislikes = photoService.getPhotoLikes($scope.photo, -1);

                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.userLocation = position.coords;
                    $scope.map = getMap(position.coords);

                    photoService.getGeoToLocation(position.coords, $scope.photo.id, function(data) {
                        $scope.position = {
                            coords: position.coords,
                            distance: data.distance / 1000,
                            direction: getDirection(data.direction)
                        };

                        $scope.photoRadius = getRadius(data.random_coord);
                    });

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
                    username: $scope.userData.username
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

        $scope.hasUserFound = function() {
            _.forEach($scope.photo.finds, function(find) {
                console.log(find.user_id, $scope.userData.user_id);
                if(find.user_id == $scope.userData.user_id) {
                    $scope.userHasFound = true;
                }
            })
        }

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
            $scope.photoTaken = false;
        }

        function init() {
            $scope.photoLoaded = false;
            $scope.userHasFound = false;
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

        function addFind() {
            var dateTime = moment().format();

            if ($scope.userData.logged_in && !$scope.userHasFound) {
                photoService.addFind($scope.userData.user_id, $scope.photo.id, dateTime);
            }
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

                    $scope.photoTaken = true;
                    photoService.getGeoToLocation(position.coords, $scope.photo.id, function(data) {
                        $scope.foundPhotoLoaded = true;
                        if (isLocationWithinRange(data.distance)) {
                            addFind();
                            $scope.photoFound = true;
                        } else {
                            $scope.photoFound = false;
                        }
                    });

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

        function getRadius(coords) {
            return {
                center: coords,
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
            };
        }

        function isLocationWithinRange(distance) {
            if (distance > 5)
                return false;
            return true;
        }

        function getDirection(direction) {
            var interval = 45;
            var heading = direction;

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