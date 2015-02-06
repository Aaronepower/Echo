function TokenService () {
  var tokenKey = 'Token'
  function getToken () {
    return window.localStorage.getItem(tokenKey)
  }

  function setToken (token) {
    window.localStorage.setItem(tokenKey, token)
  }

  function tokenExists () {
    return getToken() !== null
  }
  return { getToken : getToken
         , setToken : setToken
         , tokenExists : tokenExists
         }
}

angular.module('Intercom')
       .factory('TokenService', TokenService) 
