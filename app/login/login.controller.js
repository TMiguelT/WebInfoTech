angular.module("app")
    .controller("loginController", ["$scope", "lodash", "$http", "userService", '$location', function ($scope, _, $http, userService, $location) {
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

        $scope.getFormData = function () {
            if ($scope.mode == "login")
                return _.pick($scope.form, "email", "password");
            else
                return $scope.form;
        };

        $scope.submit = function () {
            var form = $scope.getFormData();
            if ($scope.mode == "login") {
                userService.login(form)
                    .success(function (data) {
                        //On successful login, go to the user page (will be dashboard in the future)
                        $location.path('/user');
                    })
                    .error($scope.showErrors);
            }
            else if ($scope.mode == "register") {
                userService.register(form)
                    .success(function (data) {
                        alert("Success!");
                        $scope.mode = "login";
                    })
                    .error($scope.showErrors)
            }
        };
    }]);