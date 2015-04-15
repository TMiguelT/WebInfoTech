/**
 * Created by Andrew on 1/4/2015.
 */
(function () {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", "userService", "$rootScope", function ($scope, $http, userService, $rootScope) {


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

            $scope.submit = function () {
                if (!$scope.logged_in) {
                    alert("error please log in to submit photos");
                    return;
                }

                //var submission = {
                //    "photo": $("#photoInputField")[0].files[0],
                //    "name": $scope.form.name,
                //    "description" : $scope.form.description,
                //    "hint" : $scope.form.hint,
                //    "tags" : $scope.form.tags.split(","),
                //    "user_id" : $scope.user_id,
                //    // TODO change to include location
                //    "position" : null
                //};

                var submission = new FormData();

                submission.append("photo", $("#photoInputField")[0].files[0]);
                submission.append("name", $scope.form.name);
                submission.append("description", $scope.form.description);
                submission.append("hint", $scope.form.hint);
                submission.append("tags", $scope.form.tags);
                submission.append("user_id", $scope.user_id);
                submission.append("position", null);

                // submission data is sent to the api and returned to
                // demonstrate functionality
                $http.post('/api/upload', submission, {
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
