function DashboardController ($location, UserService, API, CallService, TokenService) {
  var vm = this

  function getFriendsList () {
    API.query(function (response) {
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
  this.addFriend = function (username) {
    API.add({username : username}, friendsListChange)
  }
  this.removeFriend = function () {
    API.remove({friendId : UserService.getFriend() }, friendsListChange)
  }

  this.selectedFriend = function (friend) {
    vm.selected = friend
    UserService.setFriend(friend._id)
  }

  this.settings = function () {
    $location.path('/settings')
  }
  
  getFriendsList()
}
angular.module('Echo')
.controller('DashboardController', DashboardController)
