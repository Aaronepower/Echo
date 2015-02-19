function LoginFormController ($location, API, UserService, TokenService) {
  this.submit = function (user) {

    function success (response) {
      console.log(response)
      UserService.createUser(response.token)
      TokenService.setToken(response.token)
      $location.path('/dashboard')
      socket.emit('logged-in', UserService.getUserID())
    }

    function error (response) {
      console.log(response.status)
    }
    API.User.signin(user, success, error)
  }
}
angular.module('Intercom')
.controller('LoginFormController', LoginFormController)
