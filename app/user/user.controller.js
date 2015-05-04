angular.module("app")
    .controller("userController", ["$scope", 'lodash', "userService", "$rootScope", '$http', '$routeParams', function ($scope, _, userService, $rootScope, $http, $routeParams) {


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

        //When we load the page, request all the user's finds and photos
        $http.post('/api/user/stats')
            .success(function (data) {
                $scope.finds = data.finds;
                $scope.photos = data.photos;
            });
    }]);