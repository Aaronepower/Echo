var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var UserSchema = new Schema({ email : String
                            , username : String
			    , password : String
			    , friendsList : [String]
                            , pendingList : [String]
			    , avatar : String
                            , token : String
			    })

module.exports = mongoose.model('User', UserSchema)
