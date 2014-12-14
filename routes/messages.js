var express = require('express')
  , router  = express.Router()
  , debug   = require('debug')('Intercom')
  , Message = require('../bin/Message')

router
.post('/', function (req, res) {
  debug('MESSAGES POST Request: \n', req.body)
  var message = new Message()
  message.from = req.body.from || ''
  message.to = req.body.to || ''
  message.message = req.body.message || ''
  message.date = Date.now()

  if ( message.from    !== ''
    || message.to      !== ''
    || message.message !== ''
     ) { 
    res.status(403).end()
  } else {
    Message.find({from: req.body.from, to: req.body.to}, function (err, messages) {
      if (err)
        res.send(err)

      res.send(messages)
    })
  }
})

module.exports  = router
