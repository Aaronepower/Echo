var express = require('express')
  , router  = express.Router()
  , User    = require('../bin/User')
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
	var user = new User() 		
	user.username = req.body.username
	user.password = req.body.password
	user.avatar   = req.body.avatar

	user.save(function(err) {
		if (err)
			res.send(err)

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
