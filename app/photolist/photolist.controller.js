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

        this.currentPage = 0;
        this.photosPerPage = 10;
        this.rows = 0;


        this.goSearch = function(){
            this.currentPage = 0;
            this.rows = 0;
            this.searchPhotos();

        };

        this.searchPhotos = function() {
            self.serchDone = false;
            var coords = null;
            navigator.geolocation.getCurrentPosition(function(position) {
            //Get coordinations
            $scope.userLocation = position.coords;
        
            // Search for the right photos to show
            photoService.searchPhotos(self.orderMode,self.searchBy,self.searchMode,self.rows, self.photosPerPage,position.coords,function(photos) {
                self.photos = photos;
                self.searchDone = true;
                self.numPage = Math.floor(self.photos.length / self.photosPerPage);
                if(self.photos.length % self.photosPerPage != 0){
                    self.numPage++;
                }
            });

            }, function() {
                var error = {
                    name: "navigatorError",
                    desc: "Cannot display map - please enable your location"
                };
                console.log(error.name);
            });
       
        }

        this.orderBy = function(toOrder){
            this.orderMode = toOrder;
            this.goSearch();
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

        this.prevPage = function () {
        if (this.currentPage > 0) {
          this.currentPage--;
            };
            this.searchPhotos();
        };

        this.nextPage = function () {
        if (this.currentPage < this.photos.length - 1) {
          this.currentPage++;
            };
            self.rows = self.getRows()
            this.searchPhotos();
        };


        this.getRows = function(){
            return this.currentPage * this.photosPerPage;
        };



}]);
