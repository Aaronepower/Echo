// Conect to the hosted server's socket.io
var socket = io.connect(location.origin)
// Dependencies: 
// $routeProvider To define which partials to display and require authorization
// jwtInterceptorProvider httpInterceptor to add JWT to the requests 
// $httpProvider for adding jwtInterceptor to the list of interceptors.
function IntercomConfig ( $routeProvider
                        , $httpProvider
                        , jwtInterceptorProvider) {
  $routeProvider
  .when('/register',  { templateUrl: 'partials/register' })
  .when('/dashboard', { templateUrl: 'partials/dashboard'
                      , access : {tokenRequired : true}
                      })
  .when('/settings',  { templateUrl: 'partials/settings'
                      , access : {tokenRequired : true}
                      })
  .when('/', {redirectTo: '/dashboard'})
  .when('/login', {templateUrl : 'partials/login'})
  .otherwise({ redirectTo: '/login' })

  jwtInterceptorProvider.tokenGetter = ['TokenService',
   function (TokenService) {
    return TokenService.getToken()
  }]

  $httpProvider.interceptors.push('jwtInterceptor')
}

function IntercomRun ($rootScope, $location, API, TokenService, UserService) {
  // Whenever a user manually enters a route (eg via address bar)
  // It checks if they already have a token and validates it.
  // Success: user goes to desired route.
  // Failure: user is sent to homepage.
  $rootScope.$on('$routeChangeStart', function (event, next) {
    if (next.access) {
      if (next.access.tokenRequired) {
        if (TokenService.tokenExists()) {
          API.validate(function (response) {
            UserService.loginEvent(response.token)
          }, function (response) {
            $location.path('/login')
          })
        }
        else {
          $location.path('/login')
        }
      }
    }
  })
}

angular.module('Echo', [ 'ngRoute'
                       , 'ngResource'
                       , 'angular-jwt'
                       , 'validation.match'])
       .config(IntercomConfig)
       .run(IntercomRun)