(function () {
    'use strict';

    angular
        .module("app", ['ngRoute', 'ngCookies', 'ngLodash', 'uiGmapgoogle-maps', 'ngTagsInput', 'angular-flot'])
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/public/about/about.html',
                    controller: 'aboutController',
                    resolve: {
                        check: function ($cookies, $location) {
                            var logged_in = $cookies.logged_in;
                            if (logged_in === "true") {
                                console.log(logged_in);
                                $location.path('/dashboard');
                            }
                        }
                    }
                })
                .when('/about', {
                    templateUrl: '/public/about/about.html',
                    controller: 'aboutController'
                })
                .when('/photo/:photoId', {
                    templateUrl: '/public/game/game.html',
                    controller: 'gameController'
                })
                .when('/user/:userId?', {
                    templateUrl: '/public/user/user.html',
                    controller: 'userController'
                })
                .when('/login', {
                    templateUrl: '/public/login/login.html',
                    controller: 'loginController'
                })
                .when('/register', {
                    templateUrl: '/public/login/login.html',
                    controller: 'loginController'
                })
                .when('/photolist', {
                    templateUrl: '/public/photolist/photolist.html',
                    controller: 'photolistController'
                })
                .when('/capture', {
                    templateUrl: '/public/photocapture/photocapture.html',
                    controller: 'photoCaptureController'
                })
                .when('/leaderboard', {
                    templateUrl: '/public/leaderboard/leaderboard.html',
                    controller: 'leaderboardController'
                })
                .when('/dashboard', {
                    templateUrl: '/public/dashboard/dashboard.html',
                    controller: 'dashboardController'
                });

            $locationProvider.html5Mode(true);
        }])
})();
