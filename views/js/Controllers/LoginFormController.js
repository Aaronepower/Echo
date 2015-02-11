function LoginFormController (API, $location) {
  this.submit = function (user) {

    function success (response) {
    	$location.path('/dashboard')
      console.log(response)
    }

    function error (response) {
      console.log(response.status)
    }
    API.User.signin(user, success, error)
  }
}
angular.module('Intercom')
.controller('LoginFormController', LoginFormController)