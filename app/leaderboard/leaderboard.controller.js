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

        $scope.getWorldLeaderboard = function() {
            leaderboardService.getWorldLeaderboard(function(leaderboard) {
                $scope.worldLeaderboard = leaderboard;
            });
        };

        $scope.getFriendsLeaderboard = function() {
            leaderboardService.getFriendsLeaderboard($scope.userData.user_id, function(leaderboard) {
                $scope.friendsLeaderboard = leaderboard
            });
        }

        $scope.filterBy = function (toFilter) {
            $scope.query = toFilter;
        }

        $scope.toggleMode = function () {
            $scope.mode = oppositeMode($scope.mode);
        }

        function init() {
            $scope.photoLoaded = false;
            $scope.userData = userService.data;
            $scope.mode = "world";

            if ($scope.userData.logged_in)
                $scope.getFriendsLeaderboard();

            $scope.getWorldLeaderboard();

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
            });
        }

        init();

    }]);

