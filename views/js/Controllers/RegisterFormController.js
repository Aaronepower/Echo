function RegisterFormController (API, $location) {
	this.submit = function (user) {
		
		function success (response) {
			$location.path('/dashboard')
			console.log(response)
		}

		function error (response) {
			console.log(response.status)
		}
		API.User.save(user, success, error)
	}
}
angular.module('Intercom')
.controller('RegisterFormController', RegisterFormController)