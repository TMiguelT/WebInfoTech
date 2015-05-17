'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('app_js', function () {
    return gulp.src(['./app/app.js',
        './app/**/*.js'])
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('app.js'))
        .pipe($.sourcemaps.write('./public'))
        //.pipe($.uglify())
        .pipe(gulp.dest('./public'));
});
