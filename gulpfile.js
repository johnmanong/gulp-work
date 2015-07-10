var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var del = require('del');


var paths = {
  src: {
    scripts: ['app/js/**/*.js'],
    stylesheets: ['app/stylesheets/**/*.scss'],
  },

  dist: {
    scripts: {
      dir: 'app/build',
      name: 'all.index.js'
    },
    stylesheets: {
      dir: 'app/build',
      name: 'index.css'
    }
  }
};

// clean up dist
gulp.task('clean', function() {
  del(['app/build/*'], function (err, paths) {
      console.log('Deleted files/folders:\n', paths.join('\n'));
  });
  return;
});

// sass build
gulp.task('stylesheets', ['clean'], function() {
  return gulp.src(paths.src.stylesheets)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
   .pipe(sourcemaps.write())
   .pipe(gulp.dest(paths.dist.stylesheets.dir))
});

// javascript build
gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.src.scripts)
   .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat(paths.dist.scripts.name))
   .pipe(sourcemaps.write())
   .pipe(gulp.dest(paths.dist.scripts.dir));
});

// watcher
gulp.task('watch', function() {
  // Rerun the task when a file changes
  gulp.watch(paths.src.scripts, ['scripts']);
  gulp.watch(paths.src.stylesheets, ['stylesheets']);
});

// web server
function webserverTaskFactory(options) {
  options = options || {};

  return function() {
    gulp.src('app')
      .pipe(webserver({
        livereload: true,
        open: options.open || false
      }));
    }
}

gulp.task('webserver', webserverTaskFactory());
gulp.task('webserver:open', webserverTaskFactory({open: true}));

// default task
var defaultTasks = ['watch', 'scripts', 'stylesheets']
gulp.task('default',  defaultTasks.concat(['webserver']));
gulp.task('open', defaultTasks.concat(['webserver:open']));
