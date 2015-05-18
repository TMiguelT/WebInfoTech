/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('leaderboardController', ["$scope", "$rootScope", "userService", "leaderboardService", function ($scope, $rootScope, userService, leaderboardService) {

        /**
         *
         * getWorldLeaderboard()
         *
         * This function obtains all the usernames and scores
         *
         */
        $scope.getWorldLeaderboard = function () {
            leaderboardService.getWorldLeaderboard(function (leaderboard) {
                $scope.worldLeaderboard = leaderboard;
            });
        };

        /**
         *
         * filterBy()
         *
         * Allows a user to search through the leaderboard table for another player
         *
         * @param toFilter - the variable to filter by in the table
         */
        $scope.filterBy = function (toFilter) {
            $scope.query = toFilter;
        };


        /**
         *
         * init()
         *
         * The initializer function for the controller
         */
        function init() {
            $scope.userData = userService.data;

            $scope.getWorldLeaderboard();

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
            });
        };

        init();

    }]);

