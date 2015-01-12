var gulp            = require('gulp')
  , ngAnnotate      = require('gulp-ng-annotate')
  , concat          = require('gulp-concat')
  , uglify          = require('gulp-uglify')
  , sourcemaps      = require('gulp-sourcemaps')
  , jshint          = require('gulp-jshint')
  , jshintStylish   = require('jshint-stylish')
  , ngTemplateCache = require('gulp-angular-templatecache')
  , nodemon         = require('gulp-nodemon')
  , gutil           = require('gulp-util')
  , scss            = require('gulp-sass')
  , scsslint        = require('gulp-scss-lint')
  , del             = require('del')
  , exec            = require('child_process').exec

var paths = { scripts : 'views/js/*.js'
            , serverPaths : [ 'app.js'
                              , 'bin/*.js'
                              , 'routes/*.js'
                              ]
            , scss : 'views/js/*.scss'
            , clean : [ 'public/images/*.*'
                      , 'public/javascripts/*.*'
                      , 'public/stylesheets/*.*'
                      , '!public/javascripts/angular.min.js'
                      ]
            }

var jsConfig = { asi : true
               , laxcomma : true
               , laxbreak : true
               , bitwise : true
               , camelcase : true
               , eqeqeq : true
               , immed : true
               , latedef : "nofunc"
               , quotmark : true
               , undef : true
               , strict : true
               , maxlen : 80
               , browser : true
               , devel : true
               , predef : ['rtc']
               }

gulp.task('clean', function (cb) {
  del(paths.clean, cb)
})

gulp.task('js-lint', function() {
  var scriptPath
  if (gutil.env.server) {
    scriptPath = paths.serverPaths
    jsConfig.browser = false
    jsConfig.node = true
    jsConfig.strict = false
  }
  else {
    scriptPath = paths.scripts
  }
  return gulp.src(scriptPath)
             .pipe(jshint(jsConfig))
             .pipe(jshint.reporter(jshintStylish))
             .pipe(jshint.reporter('fail'))
})

gulp.task('scss', ['scss-lint'], function() {
	return gulp.src(paths.scss)
                   .pipe(sourcemaps.init())
                   .pipe(scss())
                   .pipe(sourcemaps.write())
                   .pipe(gulp.dest('public/css'))
})

gulp.task('scss-lint', function() {
  return gulp.src(paths.scss)
             .pipe(scsslint())
})

gulp.task('scripts', ['js-lint'], function() {
  return gulp.src(paths.scripts)
             // Uncomment once angular code is implimented
             // .pipe(ngAnnotate())
             // .pipe(ngTemplateCache())
             .pipe(sourcemaps.init())
             .pipe(concat('intercom.js'))
             .pipe(uglify())
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('public/javascripts'))
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['clean','scripts'])
})

gulp.task('demon',['recompile'], function() {
  var debug = gutil.env.debug || ''
  nodemon({ script : './bin/www'
          , ext : 'js'
          , env : { 'NODE_ENV' : 'development'
                  , 'port' : 80
                  , 'DEBUG' : debug 
                  }
          , nodeArgs : ['--use_strict']          
          , ignore : [ './node_modules/**'
                     , './gulpfile.js'
                     , './TestDB/**'
                     , './public/**'
                     ]
          })
         .on('start', ['recompile'])
         .on('change', ['recompile'])
})

gulp.task('mongo', function (cb) {
  var mongoPath
  switch (gutil.env.dev) {
    case 'J':
    case 'JM': {
      mongoPath = 'C:/Program Files/MongoDB/bin/mongod.exe'
    }
    break;
    default: {
      mongoPath = 'C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe'
    }
  }
  exec('start \"MongoDB\" \"'+mongoPath+'\" --dbpath ./TestDB/'
      , function (err, stdout, stderr) {
          console.log(stdout)
      })
})

gulp.task('recompile', ['clean', 'scss', 'scripts'])

gulp.task('default', ['demon', 'mongo'])
