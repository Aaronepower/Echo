var express = require('express')
  , router  = express.Router()
  , debug   = require('debug')('Intercom')
  , Message = require('../bin/Message')

router
.get('/', authorize, function (req, res) {
  var user = req.user
    , query = { $or : [{to : user.email}, {from : user.email}]}
  Message.find(query, function (err, messages) {
    if (err)
      res.send(err)

    if (!messages.length) {
      res.status(404).end()
    }
    else {
      res.send(messages)
    }
  })
})
.post('/', authorize, function (req, res) {
  debug('MESSAGES POST Request: \n', req.body)
  var message = new Message()
  message.from = req.user.email 
  message.to = req.body.to || ''
  message.message = req.body.message || ''
  message.date = Date.now()

  if ( message.from    !== ''
    || message.to      !== ''
    || message.message !== ''
     ) { 
    res.status(403).end()
  } else {
    message.save()
  }
})

module.exports  = router
