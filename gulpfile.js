// Dependencies
var gulp            = require('gulp')
// Adds angular dependencies so they can be used after minification
  , ngAnnotate      = require('gulp-ng-annotate')
  // Concatenates all files in given path.
  , concat          = require('gulp-concat')
  // Compresses files from given path.
  , uglify          = require('gulp-uglify')
  // Adds sourcemaps so minification can be debugged.
  , sourcemaps      = require('gulp-sourcemaps')
  // Lints the javascript to catch common errors.
  , jshint          = require('gulp-jshint')
  // Provides a clearer output to the console.
  , jshintStylish   = require('jshint-stylish')
  // restarts server on file changes
  , nodemon         = require('gulp-nodemon')
  // Allows us to pass flags from the command line.
  , gutil           = require('gulp-util')
  // Compiles scss to css.
  , scss            = require('gulp-sass')
  // Minify's the css.
  , minifyCSS       = require('gulp-minify-css')
  // Minify's the images.
  , imagemin        = require('gulp-imagemin')
  // deletes files/folders in given path.
  , del             = require('del')
  // executes a new command process to start our server
  , exec            = require('child_process').exec
  // Wraps files in content.
  , wrap            = require('gulp-wrap')

// Object containing all paths needed.
// RouteProvider is placed first as it initialises the project.
var paths = { scripts : [ 'views/js/RouteProvider.js'
                        , 'views/js/**/*.js'
                        ]
            , serverPaths : [ 'app.js'
                            , 'bin/*.*'
                            , 'routes/*.js'
                            ]
            , scss : 'views/scss/*.scss'
            , clean : [ 'public/img/*.*'
                      , 'public/javascripts/*.*'
                      , 'public/stylesheets/*.*'
                      ]
            }

// Options for how to lint our javascript.
// Option meanings availible here: http://jshint.com/docs/options/
var jsConfig = { asi : true
               , laxcomma : true
               , laxbreak : true
               , camelcase : true
               , eqeqeq : true
               , immed : true
               , latedef : "nofunc"
               , quotmark : true
               , undef : true
               , maxlen : 80
               , browser : true
               , devel : true
               , globals : { socket : true }
               , predef : ['SimpleWebRTC', 'angular', 'io']
               }

// deletes files/folders.
gulp.task('clean', function (cb) {
  del(paths.clean, cb)
})

//Lints either client side or server side javascript
gulp.task('js-lint', function() {
  var scriptPath
  if (gutil.env.server) {
    scriptPath = paths.serverPaths
    jsConfig.browser = false
    jsConfig.node = true
  }
  else {
    scriptPath = paths.scripts
  }
  return gulp.src(scriptPath)
             .pipe(jshint(jsConfig))
             .pipe(jshint.reporter(jshintStylish))
})

//Compiles and minify's scss to css.
// Destination: public/stylesheets/style.css
gulp.task('scss', function() {
  return gulp.src(paths.scss)
                   .pipe(sourcemaps.init())
                   .pipe(scss())
                   .pipe(concat('style.css'))
                   .pipe(minifyCSS())
                   .pipe(sourcemaps.write())
                   .pipe(gulp.dest('public/stylesheets'))
})

// Dependency: js-lint
// concatenates, and then wraps javascript
// in an IIFE (Immediately Invoked Function Expression)
// Then minify's
// Destination: public/javascripts/echo.js
gulp.task('scripts', ['js-lint'], function() {
  return gulp.src(paths.scripts)
             .pipe(ngAnnotate())
             .pipe(sourcemaps.init())
             .pipe(concat('echo.js'))
             .pipe(wrap('(function (){\n "use strict";\n <%= contents %>\n})();'))
             .pipe(uglify())
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('public/javascripts'))
})

// Minify's the images
// Destination: public/img
gulp.task('imagemin', function () {
  return gulp.src('views/img/*.*')
             .pipe(imagemin())
             .pipe(gulp.dest('public/img'))
})

// starts the node server, and watches for file changes.
gulp.task('demon', function() {
  var debug = gutil.env.debug || ''
  nodemon({ script : './bin/www'
          , ext : 'js'
          , env : { 'NODE_ENV' : 'development'
                  , 'port' : 80
                  , 'DEBUG' : debug 
                  }
          , ignore : [ './node_modules/**'
                     , './gulpfile.js'
                     , './TestDB/**'
                     , './public/**'
                     ]
          })
         .on('start', ['recompile'])
         .on('change', ['recompile'])
})

// Starts mongoDB with given path.
gulp.task('mongo', function (cb) {
  var mongoPath
  if (gutil.env.dbPath) {
    mongoPath = gutil.env.dbPath
  }
  else {
    mongoPath = 'C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe'
  }

  exec('start \"MongoDB\" \"'+mongoPath+'\" --dbpath ./TestDB/ --smallfiles'
      , function (err, stdout, stderr) {
          console.log(stdout)
      })
})

gulp.task('recompile', ['clean', 'scss', 'scripts', 'imagemin'])

gulp.task('default', ['demon', 'mongo'])
