/**
 * Created by Andrew on 1/4/2015.
 */
(function () {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", "userService", "$rootScope", function ($scope, $http, userService, $rootScope) {

            window.addEventListener("deviceorientation", function(event) {
                $scope.orientation = {
                    "absolute": event.absolute,
                    "alpha": event.alpha,
                    "beta": event.beta,
                    "gamma": event.gamma
                };
            }, true);

            $scope.fillMessages = {
                "file": false,
                "name": false,
                "fileType": false,
                "locationSupport": false,
                "locationAvailable": false,
                "showSuccess": false
            };

            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.position = position
            });

            navigator.geolocation.watchPosition(function (position) {
                $scope.position = position
                $scope.$apply()
            });


            // updates session information
            function sessionUpdate(data) {
                $scope.logged_in = data.logged_in;
                $scope.user_id = data.user_id;
                $scope.username = data.username;
            }

            sessionUpdate(userService.data);

            // set watch for session changes
            $rootScope.$on('sessionChanged', function (arg, data) {
                sessionUpdate(data);
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
                alert(msg);
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

                // TODO remove this dummy data
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

            $scope.submit = function (isValid) {
                if (!$scope.logged_in) {
                    alert("error please log in to submit photos");
                    return;
                }

                if (!isValid) {
                    return;
                }

                var submission = new FormData();

                // simplify tags field
                var tags = [];
                $scope.form.tags.forEach(function (tag) {
                    tags.push(tag.text);
                });

                submission.append("orientation", JSON.stringify($scope.orientation));
                submission.append("position", JSON.stringify($scope.position.coords));
                submission.append("photo", $("#photoInputField")[0].files[0]);
                submission.append("name", $scope.form.name);
                submission.append("description", $scope.form.description);
                submission.append("hint", $scope.form.hint);
                submission.append("tags", JSON.stringify(tags));
                submission.append("user_id", $scope.user_id);

                $scope.photoName = $("#photoInputField")[0].files[0].name;

                // submission data is sent to the api and returned to
                // demonstrate functionality
                $http.post('/api/photo/upload', submission, {
                    headers: {'Content-Type': undefined }
                })
                    .success(function (data) {
                        $scope.fillMessages.showSuccess = true;
                    })
                    .error($scope.showErrors);
            };
        }]);
})();
