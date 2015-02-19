function UserService ($location, jwtHelper, TokenService) {
  var user
    , friendID = '54e482b72325e9f81397d1de'

  function createUser (token) {
    user = jwtHelper.decodeToken(token)
    var event = new CustomEvent('userCreated', {detail : user})
    document.dispatchEvent(event)
  }

  function getUser() {
    return user
  }

  function getUserID() {
    return user._id
  }

  function setFriend(newFriendID) {
    friendID = newFriendID
  }

  function getFriend () {
    return friendID
  }

  function loginSuccess(response) {
      console.log(response)
      var token = response.token
      createUser(token)
      TokenService.setToken(token)
      $location.path('/dashboard')
      socket.emit('logged-in', getUserID())
  }

  function loginError (response) {
    // TODO show errors to user
    console.log(response.status)
  }
  return { createUser : createUser
         , loginSuccess : loginSuccess
         , loginError : loginError
         , getUser : getUser
         , getUserID : getUserID
         , setFriend : setFriend
         , getFriend : getFriend
         }
}

angular.module('Intercom')
      .factory('UserService', UserService)
