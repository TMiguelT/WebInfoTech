/**
 * Created by Andrew on 1/4/2015.
 */
(function() {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", function($scope, $http) {

            // This will be replaced once session service is completed
            $http.get('/api/upload_session_info')
                .success(function(data) {
                    $scope.logged_in = data.logged_in;
                    $scope.user_id = data.user_id;
                    $scope.username = data.username;
                })
                .error($scope.showErrors);




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

            $scope.submit = function() {
                var submission = $scope.form;
                submission.user_id = $scope.user_id;

                $http.post('/api/upload', submission)
                    .success(function (data) {
                        alert("post Success!\n" + data.form.name);
                    })
                    .error($scope.showErrors);
            };
        }]);
})();