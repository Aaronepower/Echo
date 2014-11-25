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
  , del             = require('del')
  , exec            = require('child_process').exec

var paths = { scripts : 'views/js/*.js'
            , scss : 'views/js/*.scss'
            , clean : [ 'public/images/*.*'
                      , 'public/javascripts/*.*'
                      , 'public/stylesheets/*.*'
                      , '!public/javascripts/angular.min.js'
                      ]
            }

var jshintOptions = { asi : true
                    , laxcomma : true
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
                    , predef : ["rtc"]
                    }

gulp.task('clean', function (cb) {
  del(paths.clean, cb)
})

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
             .pipe(jshint(jshintOptions))
             .pipe(jshint.reporter(jshintStylish))
             .pipe(jshint.reporter('fail'))
})

gulp.task('sass', function() {
	return gulp.src(paths.scss)
						 .pipe(sourcemaps.init())
						 .pipe(sass())
						 .pipe(sourcemaps.write())
						 .pipe('public/css')
})

gulp.task('scripts', ['lint'], function() {
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

gulp.task('demon', function() {
  nodemon({ script : './bin/www'
          , ext : 'js'
          , env : { 'NODE_ENV' : 'development'
                  , 'port' : 80
                  }
          , ignore : [ './node_modules/**'
                     , './gulpfile.js'
                     , './TestDB/**'
                     , './public/**'
                     ]
          })
         .on('start', ['watch'])
         .on('change', ['watch'])
})

gulp.task('mongo', function (cb) {
  var mongoPath
  console.log(gutil.env.dev);
  switch (gutil.env.dev) {
    case 'AM': {
      mongoPath = 'C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe'
    }
    break;
    case 'J':
    case 'JM': {
      mongoPath = 'C:/Program Files/MongoDB/bin/mongod.exe'
    }
    break;
    default: {
      mongoPath = 'A:/mongoDB/bin/mongod.exe'
    }
  }
  exec('start \"'+mongoPath+' --dbpath ./TestDB/\"'
      , function (err, stdout, stderr) {
          console.log(stdout)
      })
})

gulp.task('default', ['clean','demon', 'mongo', 'scripts'])