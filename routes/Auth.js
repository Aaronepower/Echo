var User  = require('../bin/User')
  , debug = require('debug')('Echo')
/**
 * @apiDefine Auth
 *  Middleware to prevent unauthorized requests without a token.
 *
 * @apiError 403 No Token was placed into the request
 * @apiError 404 No User was Found with that token
 * @apiErrorExample 404 Response:
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample 403 Response:
 *   HTTP/1.1 403 Forbidden
 */

module.exports = function (req, res, next) {
  var authHeader = req.get('authorization')
  if (typeof authHeader === 'undefined'){
    res.status(403).end()
  }
  else {
    var authValue = authHeader.split(' ')
      , token = authValue[1]

    debug('Token: ', token)
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
