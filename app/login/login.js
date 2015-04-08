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
            if ($scope.mode == "login") {
                $http.post('/api/login', $scope.form)
                    .success(function (data) {
                        alert("Success!");
                    })
                    .error($scope.showErrors);
            }
            else if ($scope.mode == "register") {
                $http.post('/api/register', $scope.form)
                    .success(function (data) {
                        alert("Success!");
                    })
                    .error($scope.showErrors)
            }
        };
    }]);