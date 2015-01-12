var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

module.exports = mongoose.model( 'User'
                               , new Schema({ email : String
                                            , username : String
                                            , password : String
                                            , friendsList : [String]
                                            , pendingList : [String]
                                            , avatar : String
                                            , token : String
                                            }
                                           )
                               )
