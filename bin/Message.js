var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var MessageSchema = new Schema({ message : String
                               , to : String
                               , from : String
                               , time : Date
                               })

module.exports = mongoose.Model('Message', MessageSchema)