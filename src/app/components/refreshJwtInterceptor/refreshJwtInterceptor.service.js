(function() {
  'use strict';

  angular
    .module('vmsFrontend')
    .factory('refreshJwtInterceptor', refreshJwtInterceptor);

  /** @ngInject */
  function refreshJwtInterceptor($injector, $q, $log, vmsLocalStorage) {
    var service = {

      responseError: function(response) {
        // IMPORTANT!
        // If the service wants use other dependencies, it should use $injector
        // to get the dependencies. Otherwise, the dependency will not be found
        var auth = $injector.get('auth');
        var $http = $injector.get('$http');
        var deferred = $q.defer();

        if (response.status === 401 && auth.isAuthenticated()) {
          $log.debug("=== 401 ===");

          var successCallback = function(jwtToken) {
            $log.debug("successCallback()");
            $log.debug(jwtToken);

            response.config.headers.Authorization = 'Bearer ' + jwtToken;

            vmsLocalStorage.setJwt(jwtToken);

            deferred.resolve();
          };
          var failureCallback = function() {
            $log.debug("failureCallback()");
            vmsLocalStorage.removeRole();
            vmsLocalStorage.removeLastName();
            vmsLocalStorage.removeUsername();
            vmsLocalStorage.removeJwt();

            deferred.reject();
          };

          auth.refreshToken().then(successCallback).catch(failureCallback);

          return deferred.promise.then(function() {
            return $http(response.config);
          });
        }

        return $q.reject(response);
      }
    };

    return service;
  }
})();
