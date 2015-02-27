function FormController ($scope, API, UserService) {
  var _scope = $scope
    , vm     = this
  // Change background once they have successfully landed on this page.
  $scope.$on('$routeChangeSuccess', function () {
    document.querySelector('html').style
                                  .backgroundImage 
                                  = 'url("/img/background.png")'
    document.querySelector('html').style.backgroundColor = ''
  })

  function formError (response) {
      UserService.loginError(vm, response)
  }

  // Login form
  this.submit = function (user) {
    API.signin(user, UserService.loginSuccess, formError)
  }
  // Register form
  this.signup = function (user) {
    API.save(user, UserService.loginSuccess, formError)
  }

  // settings initalise.
  this.settings = function () {
    _scope.user = UserService.getUser()
  }

  // settings submit.
  this.update = function (user) {
    API.update(user, UserService.loginSuccess, formError)
  }
}
angular.module('Echo')
.controller('FormController', FormController)
