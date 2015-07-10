var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');


var paths = {
  src: {
    scripts: ['app/js/**/*.js'],
    stylesheets: ['app/stylesheets/**/*.scss'],
  },

  dist: {
    scripts: {
      dir: 'app/build/',
      name: 'all.index.js'
    },
    stylesheets: ['app/build/index.css'],
  }
};

// clean up dist
gulp.task('clean', function() {
  console.log('clean')
  return;
});

// sass build
gulp.task('stylesheets', ['clean'], function() {
  console.log('stylesheets')
  return;
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

// default task
gulp.task('default', ['watch', 'scripts', 'stylesheets']);
