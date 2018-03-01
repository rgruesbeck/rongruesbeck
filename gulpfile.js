var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var hb = require('gulp-hb');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var browserSync = require('browser-sync').create();

var paths = {
  index: 'src/index.html',
  cname: 'src/CNAME',
  favicon: 'src/favicon.ico',
  files: 'src/files/**/*',
  templating: 'src/templating/**/*',
  css: 'src/css/**/*.css'
};

var assetpaths = [
  'dist/css/**/*.css'
];

function isproduction() {
  return process.env.NODE_ENV = 'production';
}

//clear dist dir
gulp.task('clear', function(done) {
  del(['dist'], done);
});


//Transfer CNAME
gulp.task('cname', function(){
  return gulp.src(paths.cname)
    .pipe(gulp.dest('dist'));
});

//Transfer favicon
gulp.task('favicon', function(){
  return gulp.src(paths.favicon)
    .pipe(gulp.dest('dist'));
});

// Minify and configure index.html
gulp.task('index', function(){
  var opts = {
    conditionals: true,
    spare:true
  };
  var target = gulp.src(paths.index);
  var sources = gulp.src(assetpaths, {read: false});

  return target.pipe(inject(sources))
    .pipe(hb({
      partials: './src/templating/partials/**/*.hbs',
      helpers: './src/templating/helpers/*.js',
      data: './src/templating/data/**/*.{js,json}'
    }))
    .pipe(replace("/dist/", "/"))
    .pipe(gulpif(isproduction(), replace("js/main.js", "js/app.min.js")))
    .pipe(gulpif(isproduction(), minifyhtml(opts)))
    .pipe(gulp.dest('dist'));
});


// Minify css
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(gulpif(isproduction(), concat('style.min.css')))
    .pipe(gulpif(isproduction(), rev()))
    .pipe(gulp.dest('dist/css'));
});


// Copy all static files 
gulp.task('files', function() {
  return gulp.src(paths.files)
    .pipe(gulp.dest('dist/files'));
});

// Serve
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});

// Rerun the task when a file changes 
gulp.task('watch', function() {
  gulp.watch(paths.index, ['index']);
  gulp.watch(paths.css, ['css']);
});

gulp.task('compile', [
  'favicon',
  'css',
  'index'
]);

gulp.task('build', [
  'compile'
]);

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['build', 'watch']);
