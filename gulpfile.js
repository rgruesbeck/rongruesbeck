var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
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

//clean build dir
gulp.task('clean', function(cb) {
  del(['build'], cb);
});


//Transfer CNAME
gulp.task('cname', function(){
  return gulp.src(paths.cname)
    .pipe(gulp.dest('build'));
});


// Minify and configure index.html
gulp.task('index-html', function(){
  var opts = {
    conditionals: true,
    spare:true
  };
  return gulp.src(paths.index)
    .pipe(replace("js/main.js", "js/app.min.js"))
    .pipe(replace("css/style.css", "css/style.min.css"))
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest('build'));
});

// Minify and copy all JavaScript (except vendor scripts) with sourcemaps all the way down 
gulp.task('js', function() {
  return gulp.src(paths.js)
      .pipe(uglify())
      .pipe(concat('app.min.js'))
    .pipe(gulp.dest('build/js'));
});

// Minify css
//.pipe(replace("../images/", "/images/"))
//.pipe(minifycss())
gulp.task('minify-css', function() {
  return gulp.src(paths.css)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build/css'));
});

// Copy all vendor javascripts
gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest('build/lib'));
});

// Copy all static images 
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/images'));
});

// Rerun the task when a file changes 
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['clean', 'index-html', 'cname', 'js', 'lib', 'minify-css', 'images']);
