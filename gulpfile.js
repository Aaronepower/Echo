var gulp            = require('gulp')
  , ngAnnotate      = require('gulp-ng-annotate')
  , concat          = require('gulp-concat')
  , uglify          = require('gulp-uglify')
  , sourcemaps      = require('gulp-sourcemaps')
  , jshint          = require('gulp-jshint')
  , jshintStylish   = require('jshint-stylish')
  , ngTemplateCache = require('gulp-angular-templatecache')
  , nodemon         = require('gulp-nodemon')
  , del             = require('del')

var paths = { scripts : 'views/js/*.js'
            , scss : 'views/js/*.scss'
            , clean : [ 'public/images/**'
                      , 'public/javascripts/**'
                      , 'public/stylesheets/**'
                      , '!public/javascripts/angular.min.js'
                      ]
            }

var jshintOptions = { asi : true
                    , laxcomma : true 
                    }

gulp.task('clean', function(cb) {
  del(paths.clean, cb)
})

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
             .pipe(jshint(jshintOptions))
             .pipe(jshint.reporter(jshintStylish))
})

gulp.task('sass', function() {
	return gulp.src(paths.scss)
						 .pipe(sourcemaps.init())
						 .pipe(sass())
						 .pipe(sourcemaps.write())
						 .pipe('public/css')
})

gulp.task('scripts', ['clean', 'lint'], function() {
  return gulp.src(paths.scripts)
             .pipe(ngAnnotate())
             .pipe(ngTemplateCache())
             .pipe(sourcemaps.init())
             .pipe(concat('all.js'))
             .pipe(uglify())
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('public/javascripts'))
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint','scripts'])
})

gulp.task('default', ['lint','scripts', 'watch'])