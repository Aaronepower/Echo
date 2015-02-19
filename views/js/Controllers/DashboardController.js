function DashboardController (UserService, API) {
  var loaded = false
    , vm = this
  document.addEventListener('userCreated', function (event) {
    vm.email = event.detail.email
  })

  API.User.query(function (response) {
    console.log(response)
    vm.friends = [response]
  })

  this.setFriend = UserService.setFriend
}
angular.module('Intercom')
.controller('DashboardController', DashboardController)
