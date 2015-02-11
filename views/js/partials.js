angular.module('Intercom', ['ngRoute', 'ngResource'])
.config(function ($routeProvider) {
	$routeProvider.
	when('/login', {
		templateUrl: 'partials/login'
	}).
	when('/dashboard', {
		templateUrl: 'partials/dashboard'
	}).
	otherwise({ redirectTo: '/register'
		, templateUrl: 'partials/register'
	})
})