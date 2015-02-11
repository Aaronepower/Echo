function UserService () {
  var user
    , friendID
  function setUser(newUser) {
    user = newUser
  }

  function getUser() {
    return user
  }

  function getUserID() {
    return user.id
  }

  function setSelectedFriend (newFriendID) {
    friendID = newFriendID
  }

  function getSelectedFriend () {
    return friendID
  }

  return { setUser : setUser
         , getUser : getUser
         , getUserID : getUserID
         }
}

angular.module('Intercom')
      .service('UserService'. UserService)
