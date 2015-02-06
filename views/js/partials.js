angular.module('Intercom', ['ngRoute', 'ngResource'])
.config(function ($routeProvider) {
  $routeProvider.
    when('/login', {
    templateUrl: 'partials/login'
  }).
    otherwise({ redirectTo: '/register'
                                       , templateUrl: 'partials/register'
  })
})
