(function() {
  'use strict';
  angular
    .module('vmsFrontend')
    .factory('userProfileEndpoint', userProfileEndpoint);

  /** @ngInject */
  function userProfileEndpoint($log, $http, apiBaseUrl) {
    var service = {
      create: create,
      get: get,
      update: update,
      drop: drop,
      getAttendingProjects: getAttendingProjects,
      passwordReset: passwordReset
    };

    return service;

    function create(user) {
      return $http({
        method: 'POST',
        url: apiBaseUrl + '/register',
        data: user
      });
    }

    function get() {
      return $http({
        method: 'GET',
        url: apiBaseUrl + '/users/me'
      });
    }

    function update(data) {
      return $http({
        method: 'PUT',
        url: apiBaseUrl + '/users/me',
        data: data
      });
    }

    function drop(credentials) {
      /**
       * @TODO: change the POST action into DELETE (?)
       */
      return $http({
        method: 'POST',
        url: apiBaseUrl + '/users/me/delete',
        data: credentials
      });
    }

    function getAttendingProjects(id) {
      return $http({
        method: 'GET',
        url: apiBaseUrl + '/users/' + id + '/attending_projects'
      });
    }

    function passwordReset(data) {
      return $http({
        method: 'POST',
        url: apiBaseUrl + '/users/forgot_password',
        data: data
      });
    }
  }

})();
