function UserService () {
  var user
    , friendID = '54d7b3f23469f2a448306960'
  function setUser(newUser) {
    console.log(newUser)
    user = newUser
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

  return { setUser : setUser
         , getUser : getUser
         , getUserID : getUserID
         , setFriend : setFriend
         , getFriend : getFriend
         }
}

angular.module('Intercom')
      .factory('UserService', UserService)
