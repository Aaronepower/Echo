var socket = io();
function IntercomConfig ($routeProvider, $httpProvider, jwtInterceptorProvider) {
	$routeProvider
	.when('/login', { templateUrl: 'partials/login' })
	.when('/dashboard', { templateUrl: 'partials/dashboard'
		                , access : {tokenRequired : true}
	                    })
	.otherwise({ redirectTo: '/register'
		       , templateUrl: 'partials/register'
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
					}, function (response) {
						TokenService.setToken(response.token)
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
