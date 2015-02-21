function DashboardController (UserService, API, CallService) {
  var loaded = false
    , vm = this
  document.addEventListener('userCreated', function (event) {
    vm.email = event.detail.email
  })

  API.User.query(function (response) {
    console.log(response)
    vm.friends = response
  })

  this.call = CallService.sendOffer
  this.stop = function () {
    CallService.stop()
    // TODO Added the hide video logic here
  }
  this.setFriend = UserService.setFriend
}
angular.module('Intercom')
.controller('DashboardController', DashboardController)
