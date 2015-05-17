/**
 * Created by Andrew on 1/4/2015.
 */
(function () {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", "$location", "userService", "$rootScope", function ($scope, $http, $location, userService, $rootScope) {

            $scope.uploading = false;

            // if the user is not logged in, redirect to the login page
            function redirectCheck() {
                if ($location.path() == "/capture") {
                    if ( $scope.logged_in != true) {
                        $location.path("/login");
                    }
                }
            }

            // updates session information
            function sessionUpdate(data) {
                $scope.logged_in = data.logged_in;
                $scope.user_id = data.user_id;
                $scope.username = data.username;
            }
            sessionUpdate(userService.data);
            $rootScope.$on('sessionChanged', function (arg, data) {
                sessionUpdate(data);
            });

            // if user navigates to this page without logging in, redirect them to the login/register page
            $rootScope.$on("$locationChangeSuccess", function () {
                redirectCheck();
            });

            $scope.initialize = function() {
                redirectCheck();
            }


            // TODO talk to miguel, not sure if time to implement orientation.
            window.addEventListener("deviceorientation", function(event) {
                $scope.orientation = {
                    "absolute": event.absolute,
                    "alpha": event.alpha,
                    "beta": event.beta,
                    "gamma": event.gamma
                };
            }, true);


            // these are used to help determine when messages should appear in the form
            // the content of each message is defined in photocapture.html
            // this is mainly used to show users what fields they need to fill out in the form.
            $scope.fillMessages = {
                "file": false,
                "name": false,
                "fileType": false,
                "locationSupport": false,
                "locationAvailable": false,
                "showSuccess": false
            };

            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.position = position;
            });

            navigator.geolocation.watchPosition(function (position) {
                $scope.position = position;
                $scope.$apply();
            });


            $scope.showErrors = function (err) {
                var msg = "Errors:\n";
                if (err instanceof Array) {
                    err.forEach(function (err) {
                        msg += JSON.stringify(err) + "\n";
                    });
                }
                else
                    msg += err;
                console.log(msg);
            };

            $scope.isValid = function () {
                                flag = true;

                if ($scope.form.name == null || $scope.form.name == "") {
                    $scope.fillMessages["name"] = true;
                    flag = false;
                }

                // check if the device support geolocation
                if (!"geolocation" in navigator) {
                    // cannot access the users location
                    $scope.fillMessages["locationSupport"] = true;
                    flag = false;
                }

                //check if the user has given permission for
                // us to access their location
                if (typeof $scope.position == "undefined") {
                    $scope.fillMessages["locationAvailable"] = true;
                    flag = false;
                }

                // TODO remove this dummy data once orientation is functioning
                if (typeof $scope.orientation == "undefined") {
                    $scope.orientation = {
                        "absolute": true,
                        "alpha": 0,
                        "beta": 0,
                        "gamma": 0
                    };
                }

                if ($("#photoInputField")[0].files[0] == null) {
                    $scope.fillMessages["file"] = true;
                    flag = false;
                } else if (".png .jpg .jpeg".search($("#photoInputField")[0].files[0].name.slice(-4).toLowerCase()) == -1) {
                    // ensure the file extension of a correct format
                    $scope.fillMessages["fileType"] = true;

                    flag = false;
                }

                return flag;
            }

            // this function is called when a new file is selected in the form
            // ensuring that the location sent to the server with the photo
            // was observed during the time in which the photo was taken
            $scope.updatePositionToSend = function() {
                console.log("updating positionToSend");
                $scope.positionToSend = JSON.stringify({
                    latitude: $scope.position.coords.latitude,
                    longitude: $scope.position.coords.longitude
                });
            }

            $scope.submit = function (isValid) {
                if (!isValid) {
                    return;
                }

                // display loading box.
                $scope.uploading = true;

                // simplify tags field
                var tags = [];
                $scope.form.tags.forEach(function (tag) {
                    tags.push(tag.text);
                });

                var submission = new FormData();
                submission.append("orientation", JSON.stringify($scope.orientation));
                submission.append("photo", $("#photoInputField")[0].files[0]);
                submission.append("name", $scope.form.name);
                submission.append("description", $scope.form.description);
                submission.append("hint", $scope.form.hint);
                submission.append("tags", JSON.stringify(tags));
                submission.append("user_id", $scope.user_id);
                submission.append("position", $scope.positionToSend);

                $scope.photoName = $("#photoInputField")[0].files[0].name;

                // submission data is sent to the api and returned to
                // demonstrate functionality
                $http.post('/api/photo/upload', submission, {
                    headers: {'Content-Type': undefined }
                })
                    .success(function (data) {
                        $scope.fillMessages.showSuccess = true;

                        // redirect user to the photo page.
                        $location.path("/photo/" + data);
                    })
                    .error($scope.showErrors);
            };
        }]);
})();
