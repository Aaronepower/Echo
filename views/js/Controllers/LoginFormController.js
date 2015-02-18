function LoginFormController ($location, API, UserService, TokenService) {
  this.submit = function (user) {

    function success (response) {
      var user = { email : response.email
                 , _id : response._id
                 , avatar : response.avatar
                 , token : response.token
                 }
      UserService.setUser(user)
      TokenService.setToken(response.token)
      $location.path('/dashboard')
      socket.emit('logged-in', user._id)
    }

    function error (response) {
      console.log(response.status)
    }
    API.User.signin(user, success, error)
  }
}
angular.module('Intercom')
.controller('LoginFormController', LoginFormController)
