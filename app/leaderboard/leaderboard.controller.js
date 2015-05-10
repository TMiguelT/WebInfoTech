/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('leaderboardController', ["$scope", "$rootScope", "userService", function ($scope, $rootScope, userService) {
        var self = this;
        var oppositeMode = function (mode) {
            if (mode == "world")
                if($scope.userData.loggedIn = true) {
                    return "friends";
                } else
                    return "world";
            else
                return "world";
        }

        /**
         *
         *  leaderboard.getAllUsers(function(users) {
         *      self.users = users;
         *
         *  if user isn't logged in - shouldn't be able to view friends button
         *
         *   if $scope.userData.loggedIn = true
         *
         */

        // this.players = player; <- emma fix this...
        self.query = null;

        self.filterBy = function (toFilter) {
            self.query = toFilter;
        }
        $scope.mode = "world";
        $scope.toggleMode = function () {
            $scope.mode = oppositeMode($scope.mode);
        }

        function init() {
            $scope.photoLoaded = false;
            $scope.userData = userService.data;

            $rootScope.$on('sessionChanged', function () {
                $scope.userData = userService.data;
            });
        }

        init();

    }]);


player = [
        {
            rank: '1',
            username: 'this will link to the players page eventually',
            score: '100'
        },
        {
            rank: '2',
            username: 'chubbs',
            score: '80'
        }
]





