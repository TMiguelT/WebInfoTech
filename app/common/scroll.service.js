(function() {
    "use strict";

    function scrollService() {
        return {
            goTo: function(elName) {
                $('html, body').animate({
                    scrollTop: $(elName).offset().top
                }, 500);
            }
        }
    }

    angular
        .module("app")
        .factory("scrollService", [scrollService]);
})();