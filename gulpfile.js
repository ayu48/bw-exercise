var gulp = require('gulp');
var connect = require('gulp-connect');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var minifyHTML = require('gulp-minify-html');

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
    gulp.watch(['./src/*.html'], ['minify-html']);
    gulp.watch(['./src/scripts/*.coffee'], ['coffee']);
});

gulp.task('minify-html', function() {
    var opts = {comments:true,spare:true};
    gulp.src('./src/index.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['connect', 'watch']);
