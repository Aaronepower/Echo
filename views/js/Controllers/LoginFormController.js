function LoginFormController (API) {
  this.submit = function (user) {

    function success (response) {
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
