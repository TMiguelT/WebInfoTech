/**
 * Created by Emma Jamieson-Hoare
 */



angular.module("app")
    .controller('friendslbController', ["$http", function ($http) {
        var self = this;

        this.players = player;

        self.orderMode = 'name';
        self.viewMode = 'list';


        self.filterBy = function (toFilter) {
            self.query = toFilter;
        }


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


