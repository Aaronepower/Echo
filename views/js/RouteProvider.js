var socket = io.connect(location.origin)

function EchoConfig ($routeProvider, $httpProvider, jwtInterceptorProvider) {
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

function EchoRun ($rootScope, $location, API, TokenService, UserService) {
  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (next.access) {
      if (next.access.tokenRequired) {
        if (TokenService.tokenExists()) {
          API.validate(function (response) {
            UserService.loginEvent(response.token)
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

angular.module('Echo', ['ngRoute', 'ngResource', 'angular-jwt'])
.config(EchoConfig)
.run(EchoRun)
