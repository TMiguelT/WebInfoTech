/**
 * Created by Johanna on 30/03/15.
 */
angular.module('app')
    .controller('photolistController', ["$http", function ($http) {
        var self = this;

        self.orderMode = 'name';
        self.viewMode = 'list';

        $http.get('./api/photos')
            .success(function(data) {
                self.photos = data.photos;
            })
            .error(function() {
                console.log("error");
            })

        self.orderBy = function(toorder){
            self.orderMode = toorder;
        };
        self.viewBy = function(toView){
            self.viewMode = toView;
        };



}]);