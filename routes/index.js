var router    = require('express').Router()
  , debug     = require('debug')('Intercom')
  , User      = require('../bin/User')
  , jwt       = require('jsonwebtoken')
  , jwtSecret = 'Super Secret'
  , auth      = require('../routes/Auth')
  

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index') 
})

router.post('/signin', function (req, res) {
  debug('/signin POST request:\n', req.body)

  User.findOne({token : req.token}, function(err, user) {
    if (err) res.send(err)

    if (!user) {
      res.status(404).end()
    }
    else {
      res.send(user)
    }
  })
})

router.post('/signup', function (req, res) {
  debug('/signup POST request:\n', req.body)

  User.find({email: req.body.email}, function (err, users) {
    if (err)
      res.send(err)

    if (users.length) {
      res.status(403).end()
    }
    else {
      var user = new User()
      user.email = req.body.email || ''
      user.password = req.body.password || ''
      user.username = req.body.username || ''
      user.avatar = req.body.avatar || ''

      if (  (user.email === '' || user.password === '') 
         && (user.password !== req.body.confirm)
         ) {
        res.status(403).end()
      }

      user.token = jwt.sign(user, jwtSecret)
      debug('User Object Created:', user)
      user.save()
      res.send(user)
    }
    
  })
})

router.post('/update', auth, function (req, res) {
  debug('/update POST request:\n', req.body)
  var user = req.user

  user.email = req.body.email || user.email
  user.username = req.body.username || user.username
  user.password = req.body.password || user.password
  user.avatar = req.body.avatar || user.avatar
  user.token = jwt.sign(user, jwtSecret)

  debug('User after updates:\n', user)
  user.save()
  res.send(user)
})

router.post('/addfriend', auth, function (req, res) {
  debug('/addfriend POST request:\n', req.body)
  var user = req.user
    , query = { $or:[ {email : req.body.email}
                    , {username : req.body.username}
                    ]
              }

  User.findOne(query, function (err, friend) {
    if (err)
      res.send(err)

    if (!user) {
      res.status(404).end()
    }
    else {
      user.friendsList.push(friend._id.toString())

      if (friend.friendsList.indexOf(user.__id.toString()) === -1)  {
        friend.pendingList.push(user.__id.toString())
      }
      friend.save()
      user.token = jwt.sign(user, jwtSecret)
      user.save()
      res.send(user)
    }
  })
})

router.post('/accept', auth, function(req, res) {
  debug('/accept POST request:\n', req.body)
  var user  = req.user
    , friendId = req.body.friendId
    , index = user.pendingList.indexOf(friendId)

  if ( index !== -1) {
    user.pendingList.splice(index, 1)
  }
  if (user.friendsList.indexOf(friendId) !== -1) {
    user.friendsList.push(friendId)
  }
  user.token = jwt.sign(user, jwtSecret)
  user.save()
  res.send(user)
})

router.post('/removefriend', auth, function (req, res) {
  debug('/removefriend POST request:\n', req.body)
  var user = req.user
    , friendId = req.body.friendId
    , index = user.friendsList.indexOf(friendId)
    , pendingIndex = user.pendingList.indexOf(friendId)

  if (index === -1) {
    if (pendingIndex !== -1) {
      user.pendingList.splice(index,1)
    }
    else {
      res.status(400).end()
    }
  }
  else {
    user.friendsList.splice(index, 1)
  }
  

  User.findOne({_id : friendId}, function (err, friend) {
    if (err)
      res.send(err)

    var friendIndex = friend.friendsList.indexOf(user._id.toString())
    friend.friendsList.splice(friendIndex, 1)
    debug('Friend saved:\n', friend)
    friend.save()
  })
  debug('User saved:\n', user)
  user.save()
  res.send(user)
})

router.get('/validate',auth, function (req, res) {
  var user = req.user
  user.token = jwt.sign(user, jwtSecret)
  user.save()
  res.send(user)
})


module.exports = router
