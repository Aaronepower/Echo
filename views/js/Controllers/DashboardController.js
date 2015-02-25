function DashboardController (UserService, API, CallService, TokenService) {
  var vm = this

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
  this.addFriend = function (friend) {
    API.User.add(friend, friendsListChange)
  }
  this.removeFriend = function (friend) {
    API.User.remove(friend, friendsListChange)
  }

  this.selectedFriend = function (friend) {
    vm.email = friend.email
    vm.avatar = friend.avatar
    UserService.setFriend(friend._id)
  }
  
  getFriendsList()
}
angular.module('Intercom')
.controller('DashboardController', DashboardController)
