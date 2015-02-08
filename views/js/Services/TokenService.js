function TokenService (APIService) {
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

  function isValidToken () {
    if (tokenExists()) {
      APIService.User.validate(function (response) {
        if (response.status !== 404) {
          setToken(response.token)
        }
      })
    }
  }
  return { getToken : getToken
         , setToken : setToken
         , tokenExists : tokenExists
         }
}

angular.module('Intercom')
       .factory('TokenService', TokenService) 
