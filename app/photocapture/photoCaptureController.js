/**
 * Created by Andrew on 1/4/2015.
 */
(function() {
    angular
        .module("app")
        .controller("photoCaptureController", ["$scope", function($scope) {
            $scope.submit = function() {
                alert("woah way to really click the button there!");
            }
        }]);
})();