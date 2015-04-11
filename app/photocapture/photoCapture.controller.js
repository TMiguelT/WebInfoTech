/**
 * Created by Andrew on 1/4/2015.
 */
(function() {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", "$http", function($scope, $http) {

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
                // alert("woah way to really click the button there!");

                $http.post('.api/upload', $scope.form)
                    .success(function (data) {
                        alert("post Success!\n" + data.form);
                    })
                    .error($scope.showErrors);
            };
        }]);
})();