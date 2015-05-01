/**
 * Created by Emma Jamieson-Hoare
 */



angular.module('app')
    .controller('leaderboardController', ["$http", "leaders", function ($http, leaders) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';

    });