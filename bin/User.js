var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var UserSchema = new Schema({ username : String
														, password : String
														, friendsList : [String]
														, avatar : String
														})

module.exports = mongoose.model('User', UserSchema)