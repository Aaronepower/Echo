var express      = require('express')
  , path         = require('path')
  , favicon      = require('serve-favicon')
  , logger       = require('morgan')
  , bodyParser   = require('body-parser')
  , compression  = require('compression')
  , session      = require('express-session')

var routes   = require('./routes/index')
  , messages = require('./routes/messages')
  , users    = require('./routes/users')
  , app      = express()
  , apiPath = '/api/'

// view engine setup
app.set('views', path.join(__dirname, 'views/jade'))
app.set('view engine', 'jade')
app.use(compression())
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers'
               , 'X-Requested-With, content-type, Authorization'
               )
  next()
})
// route = localhost/
app.use('/', routes)
// route = localhost/api/users/
app.use(apiPath+'users/', users)
// route = localhost/api/messages/
app.use(apiPath+'messages/', messages)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
}

module.exports = app
