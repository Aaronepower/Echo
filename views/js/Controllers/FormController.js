function FormController ($scope, API, UserService) {
  var _scope = $scope
  $scope.$on('$routeChangeSuccess', function () {
    document.querySelector('html').style.backgroundImage = 'url("/img/background.png")'
    document.querySelector('html').style.backgroundColor = ''
  })

  this.submit = function (user) {
    API.signin(user, UserService.loginSuccess, UserService.loginError)
  }
  this.signup = function (user) {
    API.save(user, UserService.loginSuccess, UserService.loginError)
  }

  this.settings = function () {
    _scope.user = UserService.getUser()
  }

  this.update = function (user) {
    API.update(user, UserService.loginSuccess, UserService.loginError)
  }
}
angular.module('Echo')
.controller('FormController', FormController)
