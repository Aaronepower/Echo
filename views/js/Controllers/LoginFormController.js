function LoginFormController ($location, API, UserService, TokenService) {
  this.submit = function (user) {

    function success (response) {
    	$location.path('/dashboard')
      var user = { email : response.email
                 , id : response.id
                 , avatar : response.avatar
                 }
      UserService.setUser(user)
      TokenService.setToken(response.token)
    }

    function error (response) {
      console.log(response.status)
    }
    API.User.signin(user, success, error)
  }
}
angular.module('Intercom')
.controller('LoginFormController', LoginFormController)