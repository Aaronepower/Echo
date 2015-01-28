(function () {
	'use strict';
	angular
	.module('Intercom', ['ngResource'])
	.controller('FormController', function ($resource) {

		this.submit = function (user) {
			if (  user.email !== '' 
				 && user.password !== '' 
				 && user.password === user.confirm
				 ) {

				var User = $resource('/api/users/signup/')

				User.save(user, function (newUser) {
					console.log(newUser)
				})

			}
		}
	})	
})()
