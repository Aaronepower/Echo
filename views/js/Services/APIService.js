function APIService ($resource, TokenService) {
  var usersRoute = '/api/users/'
  var authorization = {'Authorization': 'Bearer '+TokenService.getToken()}
  var User = $resource( usersRoute
                      , { signin : { method : 'POST'
                                   , url : usersRoute+'signin'
                                   }

                        , add : { method: 'POST'
                                , url : usersRoute+'add'
                                , headers : authorization 
                                }

                        , accept : { method: 'POST'
                                   , url : usersRoute+'accept'
                                   , headers : authorization
                                   }

                        , remove : { method : 'POST'
                                   , url : usersRoute+'remove'
                                   , headers : authorization
                                   }         

                        , validate : { method : 'POST'
                                     , url : usersRoute+'validate'
                                     , headers : authorization
                                     }
                        }
                      )
  var Message = $resource( '/api/messages/'
                         , { query : { method : 'GET'
                                     , headers : authorization
                                     , isArray : true
                                     }
                           , save : { method : 'POST'
                                    , headers: authorization
                                    }
                           } 
                         )
  return { User : User
         , Message: Message
         }
}

angular.module('Intercom')
       .factory('API', APIService)
