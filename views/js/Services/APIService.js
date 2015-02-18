function APIService ($http, $resource, TokenService) {

  var usersRoute = '/api/users/'

  var User = $resource( usersRoute
                      , {} 
                      , { signin : { method : 'POST'
                                   , url : usersRoute+'signin'
                                   }

                        , update : { method : 'PUT'
                                   }        

                        , add : { method: 'POST'
                                , url : usersRoute+'add'
                                }

                        , accept : { method: 'POST'
                                   , url : usersRoute+'accept'
                                   }

                        , remove : { method : 'POST'
                                   , url : usersRoute+'remove'
                                   }         

                        , validate : { method : 'GET'
                                     , url : usersRoute+'validate'
                                     }
                        }
                      )
  var Message = $resource( '/api/messages/'
                         , { query : { method : 'GET'
                                     , isArray : true
                                     }
                           , save : { method : 'POST'
                                    }
                           } 
                         )
  return { User : User
         , Message: Message
         }
}

angular.module('Intercom')
       .factory('API', APIService)
