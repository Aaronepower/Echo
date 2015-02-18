function TokenService ($window) {
  var tokenKey = 'Token'
  function getToken () {
    console.log($window.localStorage.getItem(tokenKey))
    return $window.localStorage.getItem(tokenKey)
  }

  function setToken (token) {
    $window.localStorage.setItem(tokenKey, token)
    tokenService.token = getToken()
  }

  function tokenExists () {
    return getToken() !== null
  }

  var tokenService = { getToken : getToken
                     , setToken : setToken
                     , tokenExists : tokenExists
                     , token : getToken()
                     }

  return tokenService
}

angular.module('Intercom')
       .factory('TokenService', TokenService) 
