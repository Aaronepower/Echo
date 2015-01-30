var router    = require('express').Router()
  , debug     = require('debug')('Intercom')
  , User      = require('../bin/User')
  , jwt       = require('jsonwebtoken')
  , jwtSecret = 'Super Secret'
  , authorize = require('../routes/Auth')

router.get('/', authorize, function (req, res) {
  var user = req.user

  User.find({_id : {$in : user.friendsList}}, function (err, friends) {
    if (err)
      res.send(err)

    if (!friends.length) {
      res.send(404)
    }
    else {
      friends.forEach(function (friend) {
        var props = [ 'password'
          , 'friendsList'
          , 'pendingList'
          , 'token'
        ]

        for (var i = 0; i < props.length; i++) {
          delete friend[prop[i]]

        }

        if (friend.username) {
          delete friend.email
        }
      })
      res.send(friends)
    }
  })
})

router.post('/', function (req, res) {
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

router.put('/', authorize, function (req, res) {
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

router.delete('/', authorize, function (req, res) {
  User.remove({_id : req.user._id}, function (err) {
    if (err) {
      res.send(err)
    }
    else {

      User.find({_id : {$in : req.user.friendsList}}, function (err, friends) {
        if (err) {
          res.send(err)
        }
        else {
          if (!friends.length) {
            res.send(204).end()
          }
          else {
            var id = req.user._id
            friends.forEach(function (friend) {
              var friendsListPosition = friend.friendsList.indexOf(id)
              var pendingListPosition = friend.pendingList.indexOf(id)

              if (~friendsListPosition) {
                friend.friendsList.splice(friendsListPosition, 1)
              }

              if (~pendingListPosition) {
                friend.pendingList.splice(pendingListPosition, 1)
              }
              friend.save()
            })
            res.status(204).end()
          }
        }
      })
    }
  }) 
})

router.post('/signin', function (req, res) {
  debug('/signin POST request:\n', req.body)

  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
    if (err) res.send(err)

      if (!user) {
        res.status(404).end()
      }
      else {
        res.send(user)
      }
  })
})

router.post('/add', authorize, function (req, res) {
  debug('/add POST request:\n', req.body)
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
        user.friendsList.push(friend._id.str)

        if (friend.friendsList.indexOf(user._id.str) === -1)  {
          friend.pendingList.push(user._id.str)
        }
        friend.save()
        user.token = jwt.sign(user, jwtSecret)
        user.save()
        res.send(user)
      }
    })
})

router.post('/accept', authorize, function(req, res) {
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

router.post('/remove', authorize, function (req, res) {
  debug('/remove POST request:\n', req.body)
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

    var friendIndex = friend.friendsList.indexOf(user._id.str)
    friend.friendsList.splice(friendIndex, 1)
    debug('Friend saved:\n', friend)
    friend.save()
  })
  debug('User saved:\n', user)
  user.save()
  res.send(user)
})

router.get('/validate',authorize, function (req, res) {
  var user = req.user
  user.token = jwt.sign(user, jwtSecret)
  user.save()
  res.send(user)
})

module.exports = router
