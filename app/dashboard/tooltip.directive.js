(function() {
    "use strict";

    function tooltip() {
        return {
            restrict: "A",
            link: function (scope, element) {
                $(element).hover(function () {
                    //on mouseenter
                    $(element).tooltip('show');
                }, function () {
                    //on mouseleave
                    $(element).tooltip('hide');
                });
            }
        }
    }
    angular
        .module("app")
        .directive("tooltip", tooltip);
})();
