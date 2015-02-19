function FormController (API, UserService) {
  this.submit = function (user) {
    API.User.signin(user, UserService.loginSuccess, UserService.loginError)
  }
}
angular.module('Intercom')
.controller('FormController', FormController)
