var socket = io();
function IntercomConfig ($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'partials/login'
	})
	.when('/dashboard', { templateUrl: 'partials/dashboard'
		, access : {tokenRequired : true}
	})
	.otherwise({ redirectTo: '/register'
		, templateUrl: 'partials/register'
	})
}

angular.module('Intercom', ['ngRoute', 'ngResource'])
.config(IntercomConfig)
.run(function ($rootScope, $location, API, TokenService) {
	$rootScope.$on('$routeChangeStart', function (event, next) {
		if (next.access) {
			if (next.access.tokenRequired) {
				if (TokenService.tokenExists()) {
					API.User.validate(function () {}, function (response) {
						$location.path('/')
					})
				}
				else {
					$location.path('/')
				}
			}
		}
	})
})
