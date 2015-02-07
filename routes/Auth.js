var User  = require('../bin/User')
  , debug = require('debug')('Intercom')

module.exports = function (req, res, next) {
  var authHeader = req.get('authorization')
  if (typeof authHeader === 'undefined'){
    res.status(403).end()
  }
  else {
    var authValue = authHeader.split(' ')
      , token = authValue[1]

    User.findOne({token : token}, function (err, user) {
      if (err)
        res.send(err)

      if (!user) {
        res.status(404).end()
      }
      else {
        req.user = user
        debug('User added to request:\n', req.user)
        next()
      }
    })
  }
}
