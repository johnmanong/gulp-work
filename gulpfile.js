var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var del = require('del');
var noop = require('gulp-noop');


var replace = require('gulp-replace');
var fs = require('fs');


var paths = {
  src: {
    root: 'app/index.html',
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
    },
    compiled: {
      dir: 'app/build/compiled',
      name: 'index.html'
    }
  }
};

// clean up dist
gulp.task('clean', function() {
  del.sync(['app/build/**/*', '!app/build'])
});

// sass build
function stlyesheetsBuild(useSrcMap) {
  return gulp.src(paths.src.stylesheets)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
   .pipe(useSrcMap ? sourcemaps.write() : noop())
   .pipe(gulp.dest(paths.dist.stylesheets.dir))
}

gulp.task('stylesheets', function() {
  return stlyesheetsBuild(true);
});

gulp.task('stylesheets-build', function() {
  return stlyesheetsBuild(false);
});

// javascript build
function jsBuild(useSrcMap) {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.src.scripts)
   .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat(paths.dist.scripts.name))
   .pipe(useSrcMap ? sourcemaps.write() : noop())
   .pipe(gulp.dest(paths.dist.scripts.dir));
}

gulp.task('scripts', function() {
  return jsBuild(true);
});

gulp.task('scripts-build', function() {
  return jsBuild(false);
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

// build compiled index.html file
gulp.task('compile', ['clean', 'scripts-build', 'stylesheets-build'], function() {
  return gulp.src(paths.src.root)
    // inline stylesheets
    .pipe(replace(/<link[^>]*href="([^\.]+\.css)"[^>]*>/g, function(s, filename) {
      filename = ['./app', filename].join('/');
      var style = fs.readFileSync(filename, 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    // inline js
    .pipe(replace(/<script[^>]*src="(.+\.js)"[^>]*><\/script>/g, function(s, filename) {
      filename = ['./app', filename].join('/');
      var script = fs.readFileSync(filename, 'utf8');
      return '<script>\n' + script + '\n</script>';
    }))
    .pipe(gulp.dest(paths.dist.compiled.dir))
  });

gulp.task('webserver', webserverTaskFactory());
gulp.task('webserver:open', webserverTaskFactory({open: true}));

// default task
var defaultTasks = ['watch', 'scripts', 'stylesheets'];
gulp.task('default',  defaultTasks.concat(['webserver']));
gulp.task('open', defaultTasks.concat(['webserver:open']));

// build dist
gulp.task('build-dist', ['compile']);
