angular.module("app")
    .controller("loginController", ["$scope", "lodash", "$http", function ($scope, _, $http) {
        var oppositeMode = function (mode) {
            if (mode == "login")
                return "register";
            else
                return "login";
        };

        $scope.mode = "login";
        $scope.toggleMode = function () {
            $scope.mode = oppositeMode($scope.mode);
        };
        $scope.getHeading = function () {
            return _.capitalize($scope.mode);
        };
        $scope.buttonText = function () {
            return _.capitalize(oppositeMode($scope.mode));
        };
        $scope.submit = function () {
            if ($scope.mode == "login") {

            }
            else if ($scope.mode == "register") {
                $http.post('/api/register', $scope.form)
                    .success(function (data) {
                        alert("Success!");
                    })
                    .error(function (data) {
                        var msg = "Errors:\n";
                        data.forEach(function (err) {
                           msg += JSON.stringify(err) + "\n";
                        });
                        alert(msg);
                    });
            }
        };
    }]);