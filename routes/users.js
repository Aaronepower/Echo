var express = require('express')
  , router  = express.Router()
  , debug   = require('debug')('Intercom')
  , User    = require('../bin/User')
router
.get('/', function(req, res, next) {
	debug('USERS GET Request: \n'+req)
	User.find(function(err, users) {
		if (err){
			res.send(err)
			return;
		}

			res.json(users)
			next()
	})
})
.post('/' ,function(req, res) {
	debug('USERS POST Request: \n'+req)
	var user = new User() 		
	user.username = req.body.username
	user.password = req.body.password
	user.avatar   = req.body.avatar

	user.save(function(err) {
		if (err) {
			res.send(err)
			return;
		}
		res.json(User)
	})
})

router.route('/:user_id')
      .get(function (request, response) {
		User.findById(req.params.user_id, function (error, user) {
			if (error) 
				res.send(err)

			res.json(user)
         })
      })
module.exports = router
