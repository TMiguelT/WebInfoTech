/**
 * Created by Johanna on 30/03/15.
 */
angular.module('app')
    .controller('photolistController', ["$scope","$http", "photoService","$location", function ($scope,$http, photoService, $location) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';
        $scope.searchBy = "";
        self.query = null;
        
        self.searchPhotos = function() {
            photoService.searchPhotos(self.orderMode,$scope.searchBy,function(photos) {
            self.photos = photos;
            })
        }

        self.orderBy = function(toOrder){
            self.orderMode = toOrder;
            self.searchPhotos();
        };
        self.viewBy = function(toView){
            self.viewMode = toView;
        };
        self.filterBy = function (toFilter) {
            self.query = toFilter;
        };
        self.showPhoto = function(photo){
            return photoService.getPhotoUrl();

        };

}]);
