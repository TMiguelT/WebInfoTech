'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('app_js', function() {
    return gulp.src(['./app/app.js',
                     './app/**/*.js'])
        .pipe($.concat('app.js'))
        //.pipe($.uglify())
        .pipe(gulp.dest('./public'));
});
