(function() {
    "use strict";

    function aboutController($scope) {
        $scope.goTo = function(className) {
            $('html, body').animate({
                scrollTop: $('.' + className).offset().top
            },500);
        }
    }

    angular
        .module("app")
        .controller("aboutController", ["$scope", aboutController]);
})();
