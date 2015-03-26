(function() {
    "use strict";

    function aboutController($scope) {
        $scope.goToRegistrationSteps = function() {
            $('html, body').animate({
                scrollTop: $('.main').offset().top
            },500);
        };
    }

    angular
        .module("app")
        .controller("aboutController", ["$scope", aboutController]);
})();
