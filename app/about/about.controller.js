(function() {
    "use strict";

    function aboutController($scope, scrollService) {
        $scope.goTo = function(elName) {
            scrollService.goTo(elName)
        }
    }

    angular
        .module("app")
        .controller("aboutController", ["$scope", "scrollService", aboutController]);
})();
