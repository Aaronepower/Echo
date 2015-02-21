var socket = io()

function IntercomConfig ($routeProvider, $httpProvider, jwtInterceptorProvider) {
  $routeProvider
  .when('/register', { templateUrl: 'partials/register' })
  .when('/dashboard', { templateUrl: 'partials/dashboard'
                      , access : {tokenRequired : true}
                      })
  .otherwise({ redirectTo: '/login'
             , templateUrl: 'partials/login'
             })

  jwtInterceptorProvider.tokenGetter = ['TokenService',function (TokenService) {
    return TokenService.getToken()
  }]

  $httpProvider.interceptors.push('jwtInterceptor')
}

function IntercomRun ($rootScope, $location, API, TokenService, UserService) {
  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (next.access) {
      if (next.access.tokenRequired) {
        if (TokenService.tokenExists()) {
          API.User.validate(function (response) {
            UserService.createUser(response.token)
            TokenService.setToken(response.token)
            socket.emit('logged-in', UserService.getUserID())
          }, function (response) {
            $location.path('/')
          })
        }
        else {
          $location.path('/')
        }
      }
    }
  })
}

angular.module('Intercom', ['ngRoute', 'ngResource', 'angular-jwt'])
.config(IntercomConfig)
.run(IntercomRun)
