/**
 * Created by Johanna on 30/03/15.
 */
angular.module('app')
    .controller('photolistController', ["$scope","$http", "photoService","$location", function ($scope,$http, photoService, $location) {
        var self = this;
        this.orderMode = 'name';
        this.viewMode = 'list';
        this.searchMode = 'Name';       
        $scope.searchBy = "";
        this.query = null;
        $scope.userLocation = "";
        this.serchDone = false;

        this.searchPhotos = function() {
            self.serchDone = false;
            console.log("Getting location");
            navigator.geolocation.getCurrentPosition(function(position) {

                    $scope.userLocation = position.coords;
                    console.log("Location latitute: " + $scope.userLocation.latitude);
                }, function() {
                    var error = {
                        name: "navigatorError",
                        desc: "Cannot display map - please enable your location"
                    };
                    console.log(error.name);
                });

            console.log("Location: " + $scope.userLocation);
            photoService.searchPhotos(this.orderMode,$scope.searchBy,this.searchMode,function(photos) {
            self.photos = photos;
            self.searchDone = true;
            });
        }

        this.orderBy = function(toOrder){
            this.orderMode = toOrder;
            this.searchPhotos();
        };
        this.viewBy = function(toView){
            this.viewMode = toView;
        };
        this.searchFor = function (toSearch) {
            this.searchMode = toSearch;
        };
        this.showPhoto = function(photo){
            $location.path('/photo/'+photo);

        };
        this.showTag = function(tag){
            $location.path('/tags/'+tag);

        };




}]);
