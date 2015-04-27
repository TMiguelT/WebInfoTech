(function() {
    "use strict";

    function loadingBox() {
        return {
            restrict: "E",
            scope: {
                loadingText: "=text"
            },
            templateUrl: "/public/common/loadingBox/loadingBox.html"
        }
    }

    angular
        .module("app")
        .directive("loadingBox", loadingBox);
})();
