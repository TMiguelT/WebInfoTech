/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('leaderboardController', ["$scope", "$rootScope", "userService", "leaderboardService", function ($scope, $rootScope, userService, leaderboardService) {
        var self = this;
        var oppositeMode = function (mode) {
            if (mode == "world")
                return "friends";
            else
                return "world";

        }


        $scope.getWorldLeaderboard = function () {
            leaderboardService.getWorldLeaderboard(function (leaderboard) {
                $scope.worldLeaderboard = leaderboard;
            });
        };

        $scope.filterBy = function (toFilter) {
            $scope.query = toFilter;
        };

        $scope.toUserID = 'user/{{user.user_id}}';

        $scope.toggleMode = function () {
            $scope.mode = oppositeMode($scope.mode);
        };

        function init() {
            $scope.userData = userService.data;

            $scope.getWorldLeaderboard();

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
            });
        };

        init();

    }]);

