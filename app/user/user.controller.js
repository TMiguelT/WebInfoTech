angular.module("app")
    .controller("userController", ["$scope", 'lodash', "userService", "$rootScope", '$http', '$routeParams',
        function ($scope, _, userService, $rootScope, $http, $routeParams) {

            //Whenever they change the page of the finds table, send a new request
            $scope.$watch('findPage', function () {
                $scope.loadedFinds = false;
                $http.post('/api/user/finds', {userId: $scope.userId, page: $scope.findPage})
                    .success(function (data) {
                        $scope.finds = data;
                    })
                    .finally(function () {
                        $scope.loadedFinds = true;
                    });
            });

            //Whenever they change the page of the photos table, send a new request
            $scope.$watch('photoPage', function () {
                $scope.loadedPhotos = false;
                $http.post('/api/user/photos', {userId: $scope.userId, page: $scope.photoPage})
                    .success(function (data) {
                        $scope.photos = data;
                    })
                    .finally(function () {
                        $scope.loadedPhotos = true;
                    });
            });

            $scope.hasLoaded = false;
            $scope.loadedPhotos = false;
            $scope.loadedFinds = false;
            $scope.findPage = 1;
            $scope.photoPage = 1;

            if ('userId' in $routeParams)
            //On load, if we're looking at another user, store it
                $scope.userId = $routeParams.userId;
            else {
                //Otherwise use the session data for the userId, and watch for updates
                $scope.userId = userService.data.userId;
            }

            //Request the basic data
            $http.post('/api/user/userData', {userId: $scope.userId})
                .success(function (data) {
                    _.assign($scope, data);
                })
                .finally(function () {
                    $scope.hasLoaded = true;
                });
        }]);