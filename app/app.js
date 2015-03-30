(function() {
    'use strict';

    angular
        .module("app", ['ngRoute', 'ngLodash'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './public/about/about.html',
                    controller: 'aboutController'
                })
                .when('/about', {
                    templateUrl: './public/about/about.html',
                    controller: 'aboutController'
                })
                .when('/user', {
                    templateUrl: './public/user/user.html',
                    controller: 'userController'
                })
                .when('/login', {
                    templateUrl: './public/login/login.html',
                    controller: 'loginController'
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);
})();