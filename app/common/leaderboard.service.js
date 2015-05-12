(function() {
    "use strict";

    function leaderboardService($http) {
        return {
            getWorldLeaderboard: function(callback) {
                $http
                    .get("/api/leaderboard/world")
                    .success(function(data) {
                        callback(data.leaderboard)
                    })
                    .error(function() {
                        console.error("error: unable to GET /leaderboard/world");
                    });
            },
            getFriendsLeaderboard: function(user_id, callback) {
                $http
                    .post("/api/leaderboard/friends", {user_id: user_id})
                    .success(function(data) {
                        callback(data.leaderboard)
                    })
                    .error(function() {
                        console.error("error: unable to GET /leaderboard/friends");
                    });
            }
        }
    }

    angular
        .module("app")
        .factory("leaderboardService", ["$http", leaderboardService]);
})();