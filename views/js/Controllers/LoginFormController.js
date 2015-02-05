(function() {
	'use strict';
	function LoginFormController ($resource) {
		this.submit = function (user) {
			var User = $resource('/api/users/signin')

			User.save(user, function (newUser) {
				console.log(newUser)
				console.log(typeof newUser)
			})
		}
	}
	angular.module('Intercom')
	.controller('LoginFormController', LoginFormController)
})()