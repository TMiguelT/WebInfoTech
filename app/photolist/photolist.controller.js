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

            
            if($scope.searchBy.length > 0)
            {
                photoService.searchPhotos(self.orderMode,$scope.searchBy,function(photos) {
                self.photos = photos;
                })
            }
            else{
                self.orderPhotos();

            }
        }

        self.orderPhotos = function() {
            photoService.orderPhotos(self.orderMode,function(photos) {
                self.photos = photos;
            })
        }

        self.orderBy = function(toOrder){
            self.orderMode = toOrder;
            //self.orderPhotos();
        };
        self.viewBy = function(toView){
            self.viewMode = toView;
        }

        self.filterBy = function (toFilter) {
            self.query = toFilter;
        }
        self.showPhoto = function(photo){
            $location.path('/photo/'+photo.photo_id);

        };



}]);