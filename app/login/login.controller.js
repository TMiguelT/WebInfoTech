angular.module("app")
    .controller("loginController", ["$scope", "lodash", "$http", "userService", '$location', function ($scope, _, $http, userService, $location) {

        //Calculates the other mode so that we can toggle
        var oppositeMode = function (mode) {
            if (mode == "login")
                return "register";
            else
                return "login";
        };

        //The current mode (login or register) the page is in
        $scope.mode = "login";

        //Whether or not an AJAX request is occurring
        $scope.loading = false;

        //Swaps from register to login and vice versa
        $scope.toggleMode = function () {
            $scope.mode = oppositeMode($scope.mode);
        };

        //Returns the current mode in title case
        $scope.getHeading = function () {
            return _.capitalize($scope.mode);
        };

        //Returns the opposite mode in title case for use in the button
        $scope.buttonText = function () {
            return _.capitalize(oppositeMode($scope.mode));
        };

        //Assigns to the $scope.errors to use in the alert box
        $scope.showErrors = function (err) {
            if (err instanceof Array) {
                $scope.errors = err;
            }
            else
                $scope.errors = [err];
        };

        //Whenever the mode changes, change the loading text for the spinning loader
        $scope.$watch('mode', function () {
            if ($scope.mode == "login")
                $scope.loadingText = "Logging in...";
            else
                $scope.loadingText = "Registering...";
        });

        //Only send the information we're using for a login request
        $scope.getFormData = function () {
            if ($scope.mode == "login")
                return _.pick($scope.form, "email", "password");
            else
                return $scope.form;
        };

        //Send AJAX requests on submit
        $scope.submit = function () {
            $scope.errors = "";
            var form = $scope.getFormData();
            $scope.loading = true;
            if ($scope.mode == "login") {
                userService.login(form)
                    .success(function (data) {
                        //On successful login, go to the dashboard
                        $location.path('/dashboard');
                    })
                    .error($scope.showErrors)
                    .finally(function () {
                        $scope.loading = false;
                    });
            }
            else if ($scope.mode == "register") {
                userService.register(form)
                    .success(function (data) {
                        alert("Success!");
                        $scope.mode = "login";
                    })
                    .error($scope.showErrors)
                    .finally(function () {
                        $scope.loading = false;
                    });
            }
        };
    }]);