function DashboardController ( $scope
                             , $location
                             , UserService
                             , API
                             , CallService
                             , TokenService) {
  var vm = this
  

  var userDetails = document.getElementsByClassName('userDetails')
  this.hideDetails = function () {
    for (var i; i < userDetails.length; i++) {
      userDetails[i].className += 'hideme'
    } 

  }
  this.showDetails = function () {
    for (var i; i < userDetails.length; i++) {
      userDetails[i].className = 'userDetails'
    }   
  }

  this.hideDetails()
  
  // Change background once they have successfully landed on this page.
  $scope.$on('$routeChangeSuccess', function () {
      document.querySelector('html').style.backgroundImage = 'url("")'
      document.querySelector('html').style.backgroundColor = '#3b5169'
  })

  // get friends list.
  function getFriendsList () {
    API.query(function (response) {
      vm.friends = response
    })
  }

  // friends list change.
  function friendsListChange (response) {
      TokenService.setToken(response.token)
      getFriendsList()
  }
  this.call = CallService.sendOffer
  this.stop = function () {
    CallService.endCall()
    document.getElementById('homeButton').src = 'img/logo.png' 
  }
  // Add button
  this.addFriend = function (email) {
    if (email !== UserService.getUser().email) {
      API.add({email : email}, friendsListChange)
    }
  }
  // Remove Friend
  this.removeFriend = function () {
    API.remove({friendId : UserService.getFriend() }, friendsListChange)
  }
  this.acceptFriend = function () {
    API.accept({friendId: UserService.getFriend() }, friendsListChange)
  }

  // Set as selected friend.
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

  // settings button
  this.settings = function () {
    $location.path('/settings')
  }

  this.signout = function () {
    TokenService.clearToken()
    $location.path('/login')
  }

  this.selected = UserService.getUser()
}
angular.module('Echo')
.controller('DashboardController', DashboardController)