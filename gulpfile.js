var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
  index: 'src/index.html',
  cname: 'src/CNAME',
  js: 'src/js/**/*.js',
  lib: 'src/lib/**/*.js',
  images: 'src/images/**/*',
  css: 'src/css/**/*.css'
};

//clear dist dir
gulp.task('clear', function(done) {
  del(['dist'], done);
});


//Transfer CNAME
gulp.task('cname', function(){
  return gulp.src(paths.cname)
    .pipe(gulp.dest('dist'));
});


// Minify and configure index.html
gulp.task('index', function(){
  var opts = {
    conditionals: true,
    spare:true
  };
  return gulp.src(paths.index)
    .pipe(replace("js/main.js", "js/app.min.js"))
    .pipe(replace("css/style.css", "css/style.min.css"))
    .pipe(replace('<link rel="stylesheet" href="css/bootstrap.css" media="screen" charset="utf-8">', ''))
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest('dist'));
});

// Minify and copy all JavaScript (except vendor scripts) with sourcemaps all the way down 
gulp.task('js', function() {
  return gulp.src(paths.js)
      .pipe(uglify())
      .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dist/js'));
});

// Minify css
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('dist/css'));
});

// Copy all vendor javascripts
gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest('dist/lib'));
});

// Copy all static images 
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/images'));
});

// Rerun the task when a file changes 
gulp.task('watch', function() {
    gulp.watch(paths.index, ['index']);
    gulp.watch(paths.cname, ['cname']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.lib, ['lib']);
    gulp.watch(paths.css, ['css']);
});

gulp.task('compile', [
    'index',
    'cname',
    'js',
    'lib',
    'css',
    'images'
]);

gulp.task('build', [
    'clear',
    'compile'
]);

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['build', 'watch']);