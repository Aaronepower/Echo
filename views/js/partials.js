(function () {
	'use strict';
	var Intercom = angular.module('Intercom', ['ngRoute'])

	Intercom.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
		when('/register', {
			templateUrl: 'partials/register'
		}).
		otherwise({ 
			redirectTo: 'partials/register' 
		})
	}])
})()