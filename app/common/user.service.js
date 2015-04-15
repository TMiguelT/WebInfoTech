(function () {
    "use strict";

    var defaultData = {
        logged_in: false
    };

    angular
        .module("app")
        .factory("userService", ['$http', '$rootScope', function ($http, $rootScope) {

            //Called whenever the data changes to allow you to listen for the sessionChange event
            function alertChange(newData) {
                $rootScope.$broadcast('sessionChanged', newData);
            }

            var service = {
                data: defaultData,

                login: function (form) {
                    //On login success, set the session data that was returned
                    return $http.post('/api/user/login', form).
                        success(function (data) {
                            service.data = data;
                            alertChange(data);
                        });
                },

                register: function (form) {
                    return $http.post('/api/user/register', form);
                },

                logout: function () {
                    //Logout, then reset session data to logged out state
                    return $http.post('/api/user/logout')
                        .success(function () {
                            service.data = defaultData;
                            alertChange(defaultData);
                        });
                }
            };

            $http.post('/api/user/session')
                .success(function (data) {
                    service.data = data;
                    alertChange(data);
                });

            return service;
        }]);
})();