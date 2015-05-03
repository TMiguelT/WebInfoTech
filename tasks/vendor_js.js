'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var vendor = require('./vendor.json');

gulp.task('vendor_js', function() {
    return gulp.src(vendor)
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public'));
});