function DashboardController (UserService, API, CallService, TokenService) {
  var loaded = false
    , vm = this
  // Unsure if needed anymore
  document.addEventListener('userCreated', function (event) {
    vm.email = event.detail.email
  })
  function getFriendsList () {
    API.User.query(function (response) {
      vm.friends = response
    })
  }

  function friendsListChange (response) {
      TokenService.setToken(response.token)
      getFriendsList()
  }
  this.call = CallService.sendOffer
  this.stop = function () {
    CallService.stop()
    // TODO Added the hide video logic here
  }
  this.addFriend = function (user) {
    API.User.add(user, friendsListChange)
  }
  this.removeFriend = function (user) {
    API.User.remove(user, friendsListChange)
  }
  this.setFriend = UserService.setFriend
  
  getFriendsList()
}
angular.module('Intercom')
.controller('DashboardController', DashboardController)
