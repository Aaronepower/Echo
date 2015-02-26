function DashboardController ($scope, $location, UserService, API, CallService, TokenService) {
  var vm = this

  this.selected = UserService.getUser()

  $scope.$on('$routeChangeSuccess', function () {
      document.querySelector('html').style.backgroundImage = 'url("")'
      document.querySelector('html').style.backgroundColor = '#3b5169'
  })

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
    CallService.endCall()
    // TODO Added the hide video logic here
  }
  this.addFriend = function (username) {
    API.add({username : username}, friendsListChange)
  }
  this.removeFriend = function () {
    API.remove({friendId : UserService.getFriend() }, friendsListChange)
  }

  this.selectedFriend = function (friend) {
    if (vm.selected._id && friend._id === vm.selected._id) {
      vm.call()
    }
    else {
      vm.selected = friend
      UserService.setFriend(friend._id)
    }
  }
  
  getFriendsList()

  this.settings = function () {
    $location.path('/settings')
  }
}
angular.module('Echo')
.controller('DashboardController', DashboardController)