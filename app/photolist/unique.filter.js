(function() {
    function uniqueFilter() {
        return function (arr, field) {
            console.log(arr, field);
            return _.uniq(arr, function(a) { return a[field]; });
        };
    };

    angular
        .module("app")
        .filter("unique", uniqueFilter);
})();