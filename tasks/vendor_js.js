'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('vendor_js', function() {
    return gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/bootstrap/dist/js/bootstrap.js',
        './bower_components/ng-lodash/build/ng-lodash.js'
    ])
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public'));
});