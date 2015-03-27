(function() {
    'use strict';

    angular
        .module("app", ['ngRoute'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './public/about/about.html',
                    controller: 'aboutController'
                })
                .when('/about', {
                    templateUrl: './public/about/about.html',
                    controller: 'aboutController'
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);
})();