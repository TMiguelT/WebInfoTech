angular.module("app")
    .controller("userController", ["$scope", 'lodash', "userService", "$rootScope", function ($scope, _, userService, $rootScope) {

        //Updates the local scope with session data
        function updateSession(sessionData) {
            _.merge($scope, sessionData);
        }

        //Get the starting session data
        updateSession(userService.data);
        //And watch for different session data in the future
        $rootScope.$on('sessionChanged', function (angularBullshit, data) {
            updateSession(data);
        });
    }]);