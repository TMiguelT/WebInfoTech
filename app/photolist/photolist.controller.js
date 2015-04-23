/**
 * Created by Johanna on 30/03/15.
 */
angular.module('app')
    .controller('photolistController', ["$http", "photoService", function ($http, photoService) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';

        self.getPhotos = function() {
            photoService.getAllPhotos(function(photos) {
                self.photos = photos;
            })
        }

        self.orderBy = function(toorder){
            self.orderMode = toorder;
        };
        self.viewBy = function(toView){
            self.viewMode = toView;
        };



}]);