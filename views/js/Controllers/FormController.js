function FormController (API, UserService) {
  this.submit = function (user) {
    API.signin(user, UserService.loginSuccess, UserService.loginError)
  }
}
angular.module('Echo')
.controller('FormController', FormController)
