(function() {
    "use strict";

    function navbarController($scope) {
        $scope.goTo = function(className) {
            $('html, body').animate({
                scrollTop: $('.' + className).offset().top
            },500);
        };

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
        .controller("navbarController", ["$scope", aboutController]);
})();
