//Factory object for interacting with the user and friends of the user
function UserService ($location, jwtHelper, TokenService) {
  var user
    , friends = []
    , friendID = ''
  // Creates the user object from the token given by the response
  function createUser (token) {
    user = jwtHelper.decodeToken(token)
  }
  // Get user object
  function getUser () {
    return user
  }
  // Get users' ID
  function getUserID () {
    return user._id
  }
  // set the friends
  function setFriends (newFriends) {
    friends = newFriends
  }  

  function getFriends () {
    return friends
  }

  // get a friend object from their id.
  function getFriendFromID (friend) {
    for (var i = 0; i < friends.length; i++) {
      if (friends[i]._id === friend) {
        console.log(friends[i])
        return friends[i]
      }
    }
    return null
  }
  // set the selected friend.
  function setFriend(newFriendID) {
    friendID = newFriendID
  }
  // get selected friend ID.
  function getFriend () {
    return friendID
  }
  // creates a user, stores the token and emits a login event.
  function loginEvent (token) {
    createUser(token)
    TokenService.setToken(token)
    socket.emit('logged-in', getUserID(), friends)
  }
  // on success call loginEvent and go to /dashboard
  function loginSuccess(response) {
    loginEvent(response.token)
    $location.path('/dashboard')
  }
  
  function loginError (vm, response) {
      vm.errorStatus = response.status
  }


  return { createUser : createUser
         , loginSuccess : loginSuccess
         , loginError : loginError
         , loginEvent : loginEvent
         , getUser : getUser
         , getUserID : getUserID
         , setFriend : setFriend
         , getFriend : getFriend
         , getFriendFromID : getFriendFromID
         , getFriends : getFriends
         }
}

angular.module('Echo')
      .factory('UserService', UserService)