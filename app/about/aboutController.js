(function() {
    "use strict";

    function aboutController($scope, scrollService) {
        $scope.goTo = function(elName) {
            scrollService.goTo(elName)
        }

        $(window).scroll(function() {
            var scrollVal = $(window).scrollTop();

            $(".overlay").css("opacity", scrollVal / 400);

            if (scrollVal >= $('.main').offset().top)
                $(".navbar").addClass('fadeInDown animated');
            else
                $(".navbar").removeClass('fadeInDown animated');
        });
    }

    angular
        .module("app")
        .controller("aboutController", ["$scope", "scrollService", aboutController]);
})();
