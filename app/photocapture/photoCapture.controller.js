/**
 * Created by Andrew on 1/4/2015.
 */
(function () {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", "userService", "$rootScope", function ($scope, $http, userService, $rootScope) {


            $scope.fillMessages = {
                "file": false,
                "name": false,
                "fileType": false,
                "location": false
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

                submission.append("position", JSON.stringify($scope.position.coords));
                submission.append("photo", $("#photoInputField")[0].files[0]);
                submission.append("name", $scope.form.name);
                submission.append("description", $scope.form.description);
                submission.append("hint", $scope.form.hint);
                submission.append("tags", JSON.stringify(tags));
                submission.append("user_id", $scope.user_id);



                // submission data is sent to the api and returned to
                // demonstrate functionality
                $http.post('/api/photo/upload', submission, {
                    headers: {'Content-Type': undefined }
                })
                    .success(function (data) {
                        alert("post Success!\n" +
                              $scope.username + " has uploaded a photo\n" +
                              "filename: " + data.files.photo.name + "\n" +
                              "size: " + data.files.photo.size);
                    })
                    .error($scope.showErrors);
            };
        }]);
})();
