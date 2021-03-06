(function() {
  'use strict';

  describe('refreshJwtHttpInterceptor', function() {
    var authMock,
      $q,
      $httpBackend,
      $state,
      response,
      refreshJwtHttpInterceptor,
      apiKey,
      apiBaseUrl = 'http://fake.vms.app/api',
      isAuthenticated;

    beforeEach(function() {
      module('vmsFrontend');
    });

    describe('when the reponse status is 401', function() {

      // create a fake response
      function createFakeResponse() {
        response = {
          status: 401,
          config: {
            method: 'GET',
            url: apiBaseUrl + '/my_endpoint',
            headers: {
              'Authorization': 'FakeKeRKEr',
              'X-VMS-API-Key': apiKey
            }
          }
        }
      }

      describe('auth.isAuthenticated() is true', function() {
        isAuthenticated = true;

        describe('and the refreshing token is successful', function() {

          // Mock auth service
          beforeEach(function() {
            authMock = {
              refreshToken: function() {

                return {

                  then: function(successCallback) {
                    successCallback('fooOpenFoO');

                    return {

                      catch: function() {}
                    };
                  }
                };
              },
              isAuthenticated: function() {
                return isAuthenticated;
              }
            };

            module(function($provide) {
              $provide.value('auth', authMock);
            });
          });

          // get dependencies
          beforeEach(inject(function(_refreshJwtHttpInterceptor_, _$httpBackend_, _apiKey_) {
            refreshJwtHttpInterceptor = _refreshJwtHttpInterceptor_;
            $httpBackend = _$httpBackend_;
            apiKey = _apiKey_
          }));

          beforeEach(createFakeResponse());

          it('should request again with the refreshed JWT', function() {
            $httpBackend.expectGET(apiBaseUrl + '/my_endpoint', {
              'Authorization': 'Bearer fooOpenFoO',
              'Accept': 'application/json, text/plain, */*',
              'X-VMS-API-Key': 'QLolLOlFooFooFooFoo'
            }).respond({
              'message': 'fakeerrr'
            });
            refreshJwtHttpInterceptor.responseError(response);
            $httpBackend.flush();
          });
        });

        describe('and the refreshing token is failed', function() {

          // Mock auth service for calling failure callback
          beforeEach(function() {
            authMock = {
              refreshToken: function() {

                return {

                  then: function() {

                    return {

                      catch: function(failureCallback) {
                        failureCallback();
                      }
                    };
                  }
                };
              },
              logout: jasmine.createSpy()
            };

            module(function($provide) {
              $provide.value('auth', authMock);
            });
          });

          // get dependencies
          beforeEach(inject(function(_refreshJwtHttpInterceptor_, _$q_, _$state_,
            _apiKey_) {
            refreshJwtHttpInterceptor = _refreshJwtHttpInterceptor_;
            $q = _$q_;
            $state = _$state_;
            apiKey = _apiKey_;
          }));

          beforeEach(createFakeResponse());

          // create spies for $q
          beforeEach(function() {
            var deferredMock = {
              resolve: jasmine.createSpy('resolve'),
              reject: jasmine.createSpy('reject'),
              promise: {
                then: jasmine.createSpy('then')
              }
            };

            spyOn($q, 'defer').and.returnValue(deferredMock);
          });

          // create a spy for $state
          beforeEach(function() {
            spyOn($state, 'go').and.callThrough();
          });

          it('should go login state', function() {
            refreshJwtHttpInterceptor.responseError(response);
            expect(authMock.logout).toHaveBeeCalled();
          });
        });
      });

      describe('auth.isAuthenticated() is false', function() {

        isAuthenticated = false

        beforeEach(function() {
          authMock = {
            isAuthenticated: function() {
              return isAuthenticated;
            }
          }

          module(function($provide) {
            $provide.value('auth', authMock);
          });
        });

        // get services
        beforeEach(inject(function(_refreshJwtHttpInterceptor_, _$q_, _apiKey_) {
          refreshJwtHttpInterceptor = _refreshJwtHttpInterceptor_;
          $q = _$q_;
          apiKey = _apiKey_;
        }));

        beforeEach(createFakeResponse());

        // create a spy on $q service
        beforeEach(function() {
          spyOn($q, 'reject');
        });

        it('should reject the promise', function() {
          refreshJwtHttpInterceptor.responseError(response);
          expect($q.reject).toHaveBeenCalledWith(response);
        });

      });

    });


    describe('and the response status is not 401', function() {

      // create a fake response
      function createFakeResponse() {
        response = {
          status: 400
        };
      }

      describe('auth.isAuthenticated() is true', function() {

        var $q;
        isAuthenticated = true;

        // mock the auth service and response
        beforeEach(function() {
          authMock = {
            isAuthenticated: function() {
              return isAuthenticated;
            }
          };

          module(function($provide) {
            $provide.value('auth', authMock);
          });

          createFakeResponse();
        });

        // get services
        beforeEach(inject(function(_refreshJwtHttpInterceptor_, _$q_) {
          refreshJwtHttpInterceptor = _refreshJwtHttpInterceptor_;
          $q = _$q_;
        }));

        // create a spy on $q service
        beforeEach(function() {
          spyOn($q, 'reject');
        });

        it('should reject the promise', function() {
          refreshJwtHttpInterceptor.responseError(response);
          expect($q.reject).toHaveBeenCalledWith(response);
        });
      });
    });
  });
})();
