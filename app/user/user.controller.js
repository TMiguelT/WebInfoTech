angular.module("app")
    .controller("UserController", ["$scope, lodash", function ($scope, _) {
        var oppositeMode = function (mode) {
            if ($scope.mode == "login")
                return "register";
            else
                return $scope.mode = "login";
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
    }]);