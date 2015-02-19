function UserService (jwtHelper) {
  var user
    , friendID = '54e482b72325e9f81397d1de'
  function createUser(token) {
    user = jwtHelper.decodeToken(token)
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

  return { createUser : createUser
         , getUser : getUser
         , getUserID : getUserID
         , setFriend : setFriend
         , getFriend : getFriend
         }
}

angular.module('Intercom')
      .factory('UserService', UserService)
