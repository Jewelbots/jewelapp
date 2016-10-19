var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['scripts', 'templates', 'sass', 'assets', 'fonts']);
gulp.task('scripts', function (done) {
  gulp.src('app/scripts/**/*', { base: 'app/scripts'} )
  .pipe(gulp.dest('www/scripts'))
  .on('end', done);
});

gulp.task('fonts', function (done) {
  gulp.src('app/fonts/**/*', { base: 'app/fonts'} )
    .pipe(gulp.dest('www/fonts'))
    .on('end', done);
});

gulp.task('templates', function (done) {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('www'));
  gulp.src('app/templates/**/*', { base: 'app/templates'})
    .pipe(gulp.dest('www/templates'))
    .on('end', done);
});
gulp.task('sass', function(done) {
  gulp.src('app/styles/*.*')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('www/css'))
//    .pipe(minifyCss({
//      keepSpecialComments: 0
//    }))
//   .pipe(rename({ extname: '.min.css' }))
//   .pipe(gulp.dest('www/css/'))
    .on('end', done);
});
gulp.task('assets', function (done) {
  gulp.src('app/images/*.*').pipe(gulp.dest('www/images')).on('end', done);
});
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
