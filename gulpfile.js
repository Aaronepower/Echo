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
  , minifyCSS       = require('gulp-minify-css')
  , imagemin        = require('gulp-imagemin')
  , del             = require('del')
  , exec            = require('child_process').exec
  , wrap            = require('gulp-wrap')

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

gulp.task('clean', function (cb) {
  del(paths.clean, cb)
})

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
             //.pipe(jshint.reporter('fail'))
})

gulp.task('scss', function() {
	return gulp.src(paths.scss)
                   .pipe(sourcemaps.init())
                   .pipe(scss())
                   .pipe(concat('style.css'))
                   .pipe(minifyCSS())
                   .pipe(sourcemaps.write())
                   .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('scripts', ['js-lint'], function() {
  return gulp.src(paths.scripts)
             .pipe(ngAnnotate())
             .pipe(sourcemaps.init())
             .pipe(concat('intercom.js'))
             .pipe(wrap('(function (){\n "use strict";\n <%= contents %>\n})();'))
             .pipe(uglify())
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('public/javascripts'))
})

gulp.task('imagemin', function () {
  return gulp.src('views/img/*.*')
             .pipe(imagemin())
             .pipe(gulp.dest('public/img'))
})

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

gulp.task('mongo', function (cb) {
  var mongoPath = 'C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe'

  exec('start \"MongoDB\" \"'+mongoPath+'\" --dbpath ./TestDB/ --smallfiles'
      , function (err, stdout, stderr) {
          console.log(stdout)
      })
})

gulp.task('recompile', ['clean', 'scss', 'scripts', 'imagemin'])

gulp.task('default', ['demon', 'mongo'])
