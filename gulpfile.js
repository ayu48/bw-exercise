var gulp = require('gulp');
var connect = require('gulp-connect');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('coffee', function() {
    gulp.src('./src/scripts/*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.html'], ['copy-html']);
    gulp.watch(['./src/css/*.css'], ['minify-css']);
    gulp.watch(['./src/scripts/*.coffee'], ['coffee']);
});

gulp.task('copy-html', function() {
    var opts = {empty: true};
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', function() {
    gulp.src('./src/css/*.css')
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('default', ['connect', 'watch']);
