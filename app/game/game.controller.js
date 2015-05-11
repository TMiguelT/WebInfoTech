(function() {
    "use strict";

    function gameController($scope, photoService, scrollService, userService, $routeParams, $rootScope) {

        $scope.getPhoto = function() {
            photoService.getPhotoById($routeParams.photoId, function(element) {
                $scope.photo = element.photo;

                $scope.photoLikes = photoService.getPhotoLikes($scope.photo);
                $scope.photoDislikes = photoService.getPhotoDislikes($scope.photo);

                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.map = getMap(position.coords);

                    $scope.position = {
                        coords: position.coords,
                        distance: getDistanceToLocation(position.coords, element.photo.location),
                        direction: getDirection(position.coords, element.photo.location)
                    };
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

        function init() {
            $scope.photoLoaded = false;
            $scope.userData = userService.data;
            $scope.photoLikes = 0;
            $scope.photoDislikes = 0;

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
            });
        }

        function setFoundPhotoButton() {
            $scope.photoLocation = {
                orientation: {},
                coords: {}
            }
            $scope.isOrientationCapable = false;
            $scope.foundPhotoLoaded = false;

            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(orientation){
                    if(orientation.alpha) {
                        $scope.isOrientationCapable = true;
                        $scope.photoLocation.orientation = orientation;
                    }
                });
            }

            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);

                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.photoLocation.coords = position.coords;
                });

                $scope.foundPhotoLoaded = true;
                $scope.$apply();
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