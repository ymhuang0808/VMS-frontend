(function() {
    'use strict';

    angular
        .module('vmsFrontend')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('site', {
                abstract: true,
                resolve: {
                    authorize: ['authorization', '$log', 
                        function(authorization, $log) {
                            $log.debug('== resolve, authorize ===');
                            return authorization.authorize();
                        }
                    ]
                }
            })
            .state('login', {
                parent: 'site',
                url: '/login',
                data: {
                    needAuth: false
                },
                views: {
                    'mainContent@': {
                        templateUrl: 'app/login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('registerPrivacy', {
                url: '/register-privacy',
                data: {
                    needAuth: false
                },
                views: {
                    'mainContent@': {
                        templateUrl: 'app/registerPrivacy/registerPrivacy.html',
                        controller: 'RegisterPrivacyController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('register', {
                url: '/register',
                data: {
                    needAuth: false
                },
                views: {
                    'mainContent@': {
                        templateUrl: 'app/register/register.html',
                        controller: 'RegisterController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('registerSuccess', {
                parent: 'site',
                url: '/register/success?last_name&email', // NEED to add paramters
                params: {
                    last_name: {
                        value: "志工" // default value
                    },
                    email: {
                        value: "註冊" // default value
                    }
                },
                data: {
                    needAuth: false
                },
                views: {
                    'mainContent@': {
                        templateUrl: 'app/registerSuccess/registerSuccess.html',
                        controller: 'RegisterSuccessController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('profile', {
                parent: 'site',
                url: '/profile',
                templateUrl: 'app/profile/profile.index.html',
                data: {
                    needAuth: true
                },
                views: {
                    'mainContent@': {
                        templateUrl: 'app/volunteer-profile/volunteer-profile.html',
                        controller: 'ProfileController',
                        controllerAs: 'vm'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    }

})();