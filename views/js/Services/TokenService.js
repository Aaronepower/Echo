// Factory for accessing and getting the token.
function TokenService ($window) {
  var tokenKey = 'Token'
  // Get token from storage
  function getToken () {
    return $window.localStorage.getItem(tokenKey)
  }
  // set the token
  function setToken (token) {
    $window.localStorage.setItem(tokenKey, token)
    console.log('Token set: ', token)
    tokenService.token = getToken()
  }
  // check if token is not null
  function tokenExists () {
    return getToken() !== null
  }

  function clearToken () {
    $window.localStorage.setItem(tokenKey, null)
  }

  var tokenService = { getToken : getToken
                     , setToken : setToken
                     , tokenExists : tokenExists
                     , clearToken : clearToken
                     , token : getToken()
                     }

  return tokenService
}

angular.module('Echo')
       .factory('TokenService', TokenService) 
