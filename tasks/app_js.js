'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('app_js', ['clean', 'public'], function() {
    return gulp.src(['./app/**/*.js'])
        .pipe($.concat('app.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public'));
});
