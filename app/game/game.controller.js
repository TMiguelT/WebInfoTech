(function() {
    "use strict";

    /** Game Controller
     *
     * The main controller for the game section. This controller performs CRUD actions to the Photo and User
     * API in order to obtain photo information (such as description, likes, finds, distance to photo, etc) and
     * display it to the game view (game.html).
     *
     * @param $scope            - The game model
     * @param photoService      - The photo service (makes calls to the Photo API)
     * @param scrollService     - The scroll service (used for JS scrolling)
     * @param userService       - The user service (makes calls to the User API, and obtains user information)
     * @param $routeParams      - Obtains parameters from the URL.
     * @param $rootScope        - The application model
     */

    function gameController($scope, photoService, scrollService, userService, $routeParams, $rootScope) {
        var LIKE = 1;       // value for like
        var DISLIKE = -1;   // value for dislike

        var MAX_DISTANCE_TO_PHOTO = 10;     // maximum distance to the photo in order to find it
        var PHOTO_LOCATION_RADIUS = 100;    // photo location radius on the google map

        var MIN_SCREEN_HEIGHT = 720;        // minimum screen height

        var METERS_IN_KM = 1000;            // meters in a kilometer

        var BEARING_INTERVAL = 45;          // bearing interval


        /**
         * getPhoto()
         *
         * This function obtains all the photo information and initiates the photo model.
         *
         */
        $scope.getPhoto = function() {
            // Use an async function to get the photo from the photo service.
            photoService.getPhotoById($routeParams.photoId, function(element) {

                // Assign the photo information to the scope.
                $scope.photo = element.photo;

                // Determine whether or not the user (if they are logged in) has liked or found the photo.
                $scope.hasUserLiked();
                $scope.hasUserFound();

                // Obtain the photo likes and dislikes.
                $scope.photoLikes = photoService.getPhotoLikes($scope.photo, LIKE);
                $scope.photoDislikes = photoService.getPhotoLikes($scope.photo, DISLIKE);

                // Using the navigator browser API, find the current position of the user.
                navigator.geolocation.getCurrentPosition(function(position) {

                    // Assign the users coordinates to the scope
                    $scope.userLocation = position.coords;

                    // Obtain the google map properties
                    $scope.map = getMap(position.coords);

                    // Use an async function (getGeoToLocation()) to obtain the distance and direction
                    // to the photo.
                    photoService.getGeoToLocation(position.coords, $scope.photo.id, function(data) {

                        // Assign the user coordinates, distance to photo, and direction to the scope.
                        $scope.position = {
                            coords: position.coords,
                            distance: data.distance / METERS_IN_KM,
                            direction: getDirection(data.direction)
                        };

                        // Assign the radius to the scope.
                        $scope.photoRadius = getRadius(data.random_coord);
                    });

                    // Mark photo is loaded after all of it has been done.
                    $scope.photoLoaded = true;
                    $scope.$apply();
                }, function() {
                    // If there is an error obtaining the photo, add the error.
                    var error = {
                        name: "navigatorError",
                        desc: "Cannot display map - please enable your location"
                    };
                    $scope.photo.error ? $scope.photo.error.push(error) : $scope.photo.error = [error];
                    $scope.$apply();
                });
            });
        }

        /**
         * getPhotoUrl()
         *
         * Obtain the full photo url.
         *
         * @param url - The photo name and extension.
         */
        $scope.getPhotoUrl = function(url) {
            return photoService.getPhotoUrl() + url;
        };

        /**
         * viewPhoto()
         *
         * Displays a modal with a higher resolution version of the photo
         *
         */
        $scope.viewPhoto = function() {
            $('#viewPhoto').modal('show')
        };

        /**
         *
         * goTo()
         *
         * Scrolls to a particular DOM element.
         *
         * @param elName - The name of the element (e.g. body, or .photo)
         */
        $scope.goTo = function(elName) {
            scrollService.goTo(elName);
        };

        /**
         *
         * showDescription()
         *
         * Shows the description of the photo (for mobile devices)
         *
         */
        $scope.showDescription = function() {
            $('.showDescription-button').css("display", "none");
            $('.furtherDescription').css("display", "block");
        }

        /**
         *
         * errorContains()
         *
         * Find if the error exists
         *
         * @param errorName - The error name
         */
        $scope.errorContains = function(errorName) {
            var errorFound = false;

            if (!$scope.photo || !$scope.photo.error ) return false;

            $scope.photo.error.forEach(function(error) {
                if (error.name == errorName) errorFound = true;
            });

            return errorFound;
        };

        /**
         *
         * displayError()
         *
         * Displays the error message for an error.
         *
         * @param errorName - The error name
         */
        $scope.displayError = function(errorName) {
            var errorMessage = false;

            if (!$scope.photo || !$scope.photo.error) return false;

            $scope.photo.error.forEach(function(error) {
                if (error.name == errorName) errorMessage = error.desc;
            });

            return errorMessage;
        };

        /**
         * parseDate()
         *
         * Returns a formatted date.
         *
         * @param date - The date as a timestamp.
         */
        $scope.parseDate = function(date) {
            if (moment(date).isValid())
                return moment(date).format("Do MMMM YYYY, h:mm:ss a");
            else
                return date;
        };

        /**
         *
         * doesCommentBelongToUser()
         *
         * Determine whether or not a particular comment belongs to the user.
         *
         * @param user_id - The user's ID
         */
        $scope.doesCommentBelongToUser = function(user_id) {
            return (user_id.toString() === $scope.userData.user_id);
        };

        /**
         *
         * userCannotLike()
         *
         * Determines whether or not the user can like a photo.
         *
         */
        $scope.userCannotLike = function() {
            return !$scope.userData.logged_in && $scope.likeError;
        }

        /**
         *
         * deleteComment()
         *
         * Deletes a comment.
         *
         * @param comment - The comment object.
         */
        $scope.deleteComment = function(comment) {
            var photoComments = $scope.photo.comments;

            // Iterate through all the comments
            for (var i = 0; i < photoComments.length; i++) {
                // If the comment's date and user_id match, then delete the comment.
                if ((photoComments[i].date_posted == comment.date_posted)
                    && (photoComments[i].user_id == comment.user_id)) {
                    $scope.photo.comments.splice(i, 1);
                }
            }

            // Now delete it from the database.
            photoService.deleteComment(comment)
        }

        /**
         *
         * submitComment()
         *
         * Performs the submission of a new comment
         *
         * @param comment_text - The comment's text
         */
        $scope.submitComment = function(comment_text) {
            var dateTime = moment().format();

            // Initialise an object for the new comment into the required format.
            var new_comment = {
                comment_content: {
                    date_posted: dateTime,
                    text: comment_text,
                    user_id: $scope.userData.user_id,
                    username: $scope.userData.username
                },
                photo_id: $scope.photo.id
            }

            // Add the comment to the client side (the view)
            $scope.photo.comments.push(new_comment.comment_content);

            // Add the comment to the server side (the database)
            photoService.postComment(new_comment);

            // Set the comment text back to nothing.
            $scope.comment_text = "";

        };

        /**
         * addLike()
         *
         * Add a like to a particular photo
         *
         */
        $scope.addLike = function() {
            if ($scope.userData.logged_in && !$scope.userHasLiked) {
                // Given that the user is logged in, and they have disliked the photo, and they
                // want to like the photo. Then remove the dislike, and add a like.
                if ($scope.userHasDisliked) {
                    removeDislike()
                }
                addLike()
            } else if ($scope.userData.logged_in && $scope.userHasLiked) {
                // Otherwise, given they are logged in and the user has liked the photo, then remove the like.
                removeLike()
            } else if (!$scope.userData.logged_in) {
                // If the user is not logged in, then they cannot like the photo.
                $scope.likeError = true;
            }
        };

        /**
         * addDislike()
         *
         * Add a dislike to a particular photo
         *
         */
        $scope.addDislike = function() {
            if ($scope.userData.logged_in && !$scope.userHasDisliked) {
                // Given that the user is logged in, and they have liked the photo, and they
                // want to dislike the photo. Then remove the like, and add a dislike.
                if ($scope.userHasLiked) {
                    removeLike()
                }
                addDislike()
            } else if ($scope.userData.logged_in && $scope.userHasDisliked) {
                // Otherwise, given they are logged in and the user has disliked the photo, then remove the dislike.
                removeDislike()
            } else if (!$scope.userData.logged_in) {
                // If the user is not logged in, then they cannot dislike the photo.
                $scope.likeError = true;
            }
        };

        /**
         *
         * hasUserLiked()
         *
         * Determine whether or not the user has liked the photo
         *
         */
        $scope.hasUserLiked = function() {
            // Iterate through the photo likes
            _.forEach($scope.photo.likes, function(like) {
                // If the photo like user id matches the user's id, then mark that the
                // user has liked the photo
                if (like.user_id == $scope.userData.user_id) {
                    if (like.value === LIKE)
                        $scope.userHasLiked = true;
                    else
                        $scope.userHasDisliked = true;
                }
            });
        };

        /**
         *
         * hasUserLiked()
         *
         * Determine whether or not the user has liked the photo
         *
         */
        $scope.hasUserFound = function() {
            // Iterate through the photo finds
            _.forEach($scope.photo.finds, function(find) {
                // If the photo find user id matches the user's id, then mark that the
                // user has found the photo.
                if(find.user_id == $scope.userData.user_id) {
                    $scope.userHasFound = true;
                }
            })
        }

        /**
         *
         * changeMapCenter()
         *
         * Change the google map's center point.
         *
         * @param centerType - The user's location or photo location.
         */
        $scope.changeMapCenter = function(centerType) {
            $scope.centerType = centerType;

            // If the center type is the user location, then set the center point to the user's
            // location.
            // Otherwise, set the center point to a random point within 50 meters of the photo.
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

        /**
         *
         * tryAgain()
         *
         * If the user fails to find the photo then set the foundPhotoLoaded and photoTaken
         * variables to false
         *
         */
        $scope.tryAgain = function() {
            $scope.foundPhotoLoaded = false;
            $scope.photoTaken = false;
        }

        /**
         *
         * init()
         *
         * The initialiser function for the controller.
         *
         */
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

        /**
         *
         * addDislike()
         *
         * Add a dislike to the photo
         *
         */
        function addDislike() {
            $scope.photoDislikes++;
            $scope.userHasDisliked = true;
            photoService.addLike($scope.userData.user_id, $scope.photo.id, -1)
        }

        /**
         *
         * addLike()
         *
         * Add a like to the photo
         *
         */
        function addLike() {
            $scope.photoLikes++;
            $scope.userHasLiked = true;
            photoService.addLike($scope.userData.user_id, $scope.photo.id, 1)

        }

        /**
         *
         * removeDislike()
         *
         * Remove a dislike from the photo
         *
         */
        function removeDislike() {
            $scope.photoDislikes--;
            $scope.userHasDisliked = false;
            photoService.removeLike($scope.userData.user_id, $scope.photo.id, -1)
        }

        /**
         *
         * removeLike()
         *
         * Remove a like from the photo
         *
         */
        function removeLike() {
            $scope.photoLikes--;
            $scope.userHasLiked = false;
            photoService.removeLike($scope.userData.user_id, $scope.photo.id, 1);
        }

        /**
         *
         * addFind()
         *
         * Add a find to the photo
         *
         */
        function addFind() {
            var dateTime = moment().format();

            if ($scope.userData.logged_in && !$scope.userHasFound) {
                photoService.addFind($scope.userData.user_id, $scope.photo.id, dateTime);
            }
        }

        /**
         *
         * setFoundPhotoButton()
         *
         * Set up the found photo button
         *
         */
        function setFoundPhotoButton() {
            // Initialise the photoLocation object
            var photoLocation = {
                orientation: {},
                coords: {}
            };


            $scope.isOrientationCapable = false;
            $scope.foundPhotoLoaded = false;
            $scope.photoFound = false;

            // If the device is orientation capable, then set isOrientationCapable to true, and
            // obtain the orientation.
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(orientation){
                    if(orientation.alpha) {
                        $scope.isOrientationCapable = true;
                        photoLocation.orientation = orientation;
                    }
                });
            }

            // Async function when the photo has been taken.
            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);

                // Async function to get the user's location
                navigator.geolocation.getCurrentPosition(function(position) {

                    // Set the photoLocation coordinates.
                    photoLocation.coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    // Set the photo as taken to true
                    $scope.photoTaken = true;

                    photoService.getGeoToLocation(position.coords, $scope.photo.id, function(data) {

                        $scope.foundPhotoLoaded = true;

                        // If the user's location is within range of the photo's location then add
                        // the find and set photo found to be true.
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
            if ($(".photo-description").height() < MIN_SCREEN_HEIGHT) {
                $(".photo-description").css("height", "730px");
            } else {
                $(".photo-description").css("height", "100%");
            }
        }

        /**
         *
         * getMap()
         *
         * Returns an object containing the map properties based on
         * the user's location
         *
         * @param posCoords - the users coordinates
         *
         */
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

        /**
         *
         * getRadius()
         *
         * Returns an object containing the circle properties for the
         * google map.
         *
         * @param coords - The coordinates of the center point of the radius
         */
        function getRadius(coords) {
            return {
                center: coords,
                radius: PHOTO_LOCATION_RADIUS,
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

        /**
         *
         * isLocationWithinRange()
         *
         * Determine if the distance is within range.
         *
         * @param distance - The distance from the user to the photo.
         */
        function isLocationWithinRange(distance) {
            if (distance > MAX_DISTANCE_TO_PHOTO)
                return false;
            return true;
        }

        /**
         * getDirection()
         *
         * Get the direction as a string from the user to the photo.
         *
         * @param direction - The bearings
         */
        function getDirection(direction) {
            var interval = BEARING_INTERVAL;
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

    /**
     * Initialise the game controller with the specified dependencies.
     */
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