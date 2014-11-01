var express = require('express')
  , router  = express.Router()
  , User    = require('../bin/User')
/* GET users listing. */
router
.get('/', function(req, res, next) {
	User.find(function(err, users) {
		if (err) res.send(err)

		res.json(users)
	})
})
.post('/' ,function(req, res) {
		console.log('started')
		console.log(req.body)
		var user = new User() 		// create a new instance of the user model
		user.username = req.body.username  // set the users name (comes from the request)
		user.password = req.body.password
		user.avatar   = req.body.avatar
		console.log(user);

		// save the user and check for errors
		user.save(function(err) {
			if (err)
				res.send(err)

			res.json(User)
		})
		
	})

module.exports = router
