(function () {
	'use strict';
	angular
	.module('Intercom', ['ngResource'])
	.controller('FormController', function ($resource) {

		this.submit = function (user) {

				var User = $resource('/api/users/signup/')

				User.save(user, function (newUser) {
					console.log(newUser)
				})

		}
	})	
})()
