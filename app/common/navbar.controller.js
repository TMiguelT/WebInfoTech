(function () {
    "use strict";

    function navbarController($scope, userService, $rootScope, $location) {

        //Updates the local scope with session data
        function updateSession(sessionData) {
            $scope.logged_in = sessionData.logged_in;
            $scope.username = sessionData.username;
        }

        $scope.goToPage = function(page) {
            $location.path(page);
        }

        $scope.logOut = function () {
            userService.logout()
                .success(function(data) {
                    //On successful logout return to about page
                    $location.path('/');
                })
                .error($scope.showErrors());

        };

        //Get the starting session data
        updateSession(userService.data);
        //And watch for different session data in the future
        $rootScope.$on('sessionChanged', function (angularBullshit, data) {
            updateSession(data);
        });
    }

    angular
        .module("app")
        .controller("navbarController", ["$scope", 'userService', '$rootScope', '$location', navbarController]);
})();
