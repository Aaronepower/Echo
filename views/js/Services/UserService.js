function UserService (jwtHelper) {
  var user
    , friendID = '54d7b3f23469f2a448306960'
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
