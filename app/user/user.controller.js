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

            //True when the basic stats have loaded
            $scope.hasLoaded = false;
            //True when the request for getting the photos is complete
            $scope.loadedPhotos = false;
            //True when the request for getting the found photos is complete
            $scope.loadedFinds = false;
            
            //Setting these variables will trigger the $scope.$watch which will fire the queries
            //The current page of the found photos list (it's paginated into groups of 10 photos)
            $scope.findPage = 1;
            //The current page of the taken photos list (it's paginated into groups of 10 photos)
            $scope.photoPage = 1;

            //Request the basic data
            $http.post('/api/user/userData', {userId:  $routeParams.userId})
                .success(function (data) {
                    _.assign($scope, data);
                })
                .finally(function () {
                    $scope.hasLoaded = true;
                });
        }
    ]);