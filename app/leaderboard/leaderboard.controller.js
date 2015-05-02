/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('leaderboardController', ["$http", function ($http) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';

    }]);