/**
 * Created by Johanna on 30/03/15.
 */
angular.module('app')
    .controller('photolistController', ["$http", "photoService","$location", function ($http, photoService, $location) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';
        self.query = null;
        self.getPhotos = function() {
            photoService.getAllPhotos(function(photos) {
                self.photos = photos;
            })
        }

        self.orderBy = function(toOrder){
            self.orderMode = toOrder;
        };
        self.viewBy = function(toView){
            self.viewMode = toView;
        }

        self.filterBy = function (toFilter) {
            self.query = toFilter;
        }
        self.showPhoto = function(photo){
            $location.path('/photo/'+photo.id);

        }
        ;



}]);