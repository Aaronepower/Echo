var router    = require('express').Router()
  , debug     = require('debug')('Intercom')
  , User      = require('../bin/User')
  , jwt       = require('jsonwebtoken')
  , jwtSecret = 'Super Secret'
  , authorize = require('../routes/Auth')

router.get('/', authorize, function (req, res) {
  var user = req.user
    , friendsAndPending = user.friendsList.concat(user.pendingList)

  User.find({_id : {$in : friendsAndPending}}, function (err, friends) {
    if (err)
      res.send(err)

    if (!friends.length) {
      res.status(404).end()
    }
    else {
      var modifiedFriends = []
      friends.forEach(function (friend) {
        friend = friend.toObject()
        user.pendingList.forEach(function (pendingFriendId) {
          if (friend._id.str === pendingFriendId.str) {
            friend.pending = true
          }
        })

        delete friend.password
        delete friend.friendsList
        delete friend.pendingList
        delete friend.token
        delete friend.__v

        if (friend.username) {
          delete friend.email
        }
        else {
          delete friend.username
        }
        modifiedFriends.push(friend)
      })
      res.send(modifiedFriends)
    }
  })
})

router.post('/', function (req, res) {
  debug('/signup POST request:\n', req.body)

  User.find({email: req.body.email}, function (err, users) {
    if (err)
      res.send(err)

    if (users.length) {
      res.status(406).end()
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

         user.token = jwt.sign(safeUser(user, true), jwtSecret)
         debug('User Object Created:', user)
         user.save()
         res.send({token : user.token})
    }

  })
})

router.put('/', authorize, function (req, res) {
  debug('/update PUT request:\n', req.body)
  var user = req.user

  user.email = req.body.email || user.email
  user.username = req.body.username || user.username
  user.password = req.body.password || user.password
  user.avatar = req.body.avatar || user.avatar
  user.token = jwt.sign(safeUser(user, true), jwtSecret)

  debug('User after updates:\n', user)
  user.save()
  res.send({token : user.token})
})

router.delete('/', authorize, function (req, res) {
  User.remove({_id : req.user._id}, function (err) {
    if (err) {
      res.send(err)
    }
    else {
      var user              = req.user
        , friendsAndPending = user.friendsList.concat(user.pendingList)

      User.find({_id : {$in : friendsAndPending}}, function (err, friends) {
        if (err) {
          res.send(err)
        }
        else {
          if (!friends.length) {
            res.send(204).end()
          }
          else {
            var id = user._id
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

  var query = { $or : [ {email : req.body.email}
                      , {username : req.body.username}
                      ] 
                    , password : req.body.password                    
              }
  User.findOne(query, function(err, user) {
    if (err) { 
      res.send(err)
    }
    else {

      if (!user) {
        res.status(404).end()
      }
      else {
        res.send({token : user.token})
      }
    }
  })
})

router.post('/add', authorize, function (req, res) {
  debug('/add POST request:\n', req.body)
  var user = req.user
    , query = { $or : [ {email : req.body.email}
                      , {username : req.body.username}
                      ]
              }
    
  User.findOne(query, function (err, friend) {
    if (err)
      res.send(err)

    if (!friend) {
      res.status(404).end()
    }
    else {
      if (!~user.friendsList.indexOf(friend._id)) {
        user.friendsList.push(friend._id)
      }

      if (!~friend.friendsList.indexOf(user._id) 
          && !~friend.pendingList.indexOf(user._id))  {
        friend.pendingList.push(user._id)
      }
      friend.save()
      user.token = jwt.sign(safeUser(user, true), jwtSecret)
      user.save()
      res.send({token : user.token})
    }
  })
})

router.post('/accept', authorize, function(req, res) {
  debug('/accept POST request:\n', req.body)
  var user     = req.user
    , friendId = req.body.friendId
    , index    = user.pendingList.indexOf(friendId)

  if (~index) {
    user.pendingList.splice(index, 1)

    if (!~user.friendsList.indexOf(friendId)) {
      user.friendsList.push(friendId)
    }
  }

  user.token = jwt.sign(safeUser(user, true), jwtSecret)
  user.save()
  res.send({token : user.token})
})

router.post('/remove', authorize, function (req, res) {
  debug('/remove POST request:\n', req.body)
  var user = req.user
    , friendId = req.body.friendId
    , index = user.friendsList.indexOf(friendId)
    , pendingIndex = user.pendingList.indexOf(friendId)

  if (!~index) {
    if (~pendingIndex) {
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

    var friendIndex = friend.friendsList.indexOf(user._id)
    if (~friendIndex) {
      friend.friendsList.splice(friendIndex, 1)
    }

    var pendingIndex = friend.pendingList.indexOf(user._id)
    if (~pendingIndex) {
      friend.pendingList.splice(pendingIndex, 1)
    
    }
    debug('Friend saved:\n', friend)
    friend.save()
  })

  debug('User saved:\n', user)
  user.save()
  res.send({token : user.token})
})

router.get('/validate',authorize, function (req, res) {
  var user = req.user
  user.token = jwt.sign(safeUser(user, true), jwtSecret)
  user.save()
  res.send({token : user.token})
})

function safeUser(user, deleteToken) {
  var newUser = user.toObject()

  delete newUser.password
  delete newUser.__v

  if (deleteToken) {
    delete newUser.token
  }
  return newUser
}
module.exports = router
