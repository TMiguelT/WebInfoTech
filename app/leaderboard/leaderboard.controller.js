/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('leaderboardController', ["$http", function ($http) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';


        self.filterBy = function (toFilter) {
            self.query = toFilter;
        }

    }]);


function init() {
    $scope.photoLoaded = false;
    $scope.userData = userService.data;

    $rootScope.$on('sessionChanged', function () {
        $scope.userData = userService.data;
    });
}


function Cntrl ($scope, $location) {
    $scope.changeView = function() {
        $location.path('/friendslb')
    }
}


