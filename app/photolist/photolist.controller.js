/**
 * Created by Johanna Sjogren on 30/03/15.
 */



angular.module('app')
    .controller('photolistController', ["$scope","$http", "photoService","$location", function ($scope,$http, photoService, $location) {
        var self = this;
        // Initial Parameters
        this.orderMode = 'Name';
        this.searchMode = 'Name';       

        $scope.searchBy = "";
        $scope.userLocation = "";

        this.currentPage = 0;
        this.photosPerPage = 10;
        this.rows = 0;

        /**
         * goSearch ()
         *
         * Function that sets current page and rows to zero if a new search is commitet
         */
        this.goSearch = function(){
            this.currentPage = 0;
            this.rows = 0;
            this.searchPhotos();

        };

        /**
         * SearchPhotos()
         *
         * Function that get the user coordinates and get the photos from photoService
         *
         */
        this.searchPhotos = function() {
            self.serchDone = false;
            var coords = null;
            navigator.geolocation.getCurrentPosition(function(position) {
            //Get coordinations
            
            // Search for the right photos to show
            photoService.searchPhotos(self.orderMode,self.searchBy,self.searchMode,self.rows, self.photosPerPage,position.coords,function(photos) {
                self.photos = photos;
                self.searchDone = true;
            });

            }, function() {
                var error = {
                    name: "navigatorError",
                    desc: "Cannot display distance to photos - please enable your location"
                };
                console.log(error.name);

                var position;
                // If the coordinates could not be obtained, do another search with undefined position.
                photoService.searchPhotos(self.orderMode,self.searchBy,self.searchMode,self.rows, self.photosPerPage,position,function(photos) {
                   self.photos = photos;
                self.searchDone = true;
                });
            });


       
        };

        /**
         * orderBy()
         *
         * Changes the order mode of the photos
         *
         */
        this.orderBy = function(toOrder){
            this.orderMode = toOrder;
            this.goSearch();
        };
        /**
         * toView()
         *
         * Changes the number of photos to be displayed
         *
         */
        this.viewBy = function(toView){
            this.photosPerPage = toView;
            this.goSearch();
        };

        /**
         * searchFor()
         *
         * Changes what category to search for
         *
         */
        this.searchFor = function (toSearch) {
            this.searchMode = toSearch;
        };


        /**
         * showPhoto()
         *
         * If a photo is selected, go to the photo page
         *
         */

        this.showPhoto = function(photo){
            $location.path('/photo/'+photo);

        };


        /**
         * prevPage()
         *
         * Changes the current page
         *
         */
        this.prevPage = function () {
        self.serchDone = false;
        if (this.currentPage > 0) {
          this.currentPage--;
            };
            this.searchPhotos();
        };

        /**
         * nextPage()
         *
         * Changes current page
         *
         */
        this.nextPage = function () {
        self.serchDone = false;
        if (this.currentPage < this.photos.length - 1) {
          this.currentPage++;
            };
            self.rows = self.getRows()
            this.searchPhotos();
        };


        /**
         * getRows()
         *
         * Changes the rows to be obtained from the database
         *
         */
        this.getRows = function(){
            return this.currentPage * this.photosPerPage;
        };



}]);
