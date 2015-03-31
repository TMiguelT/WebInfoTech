"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var requireDir = require('require-dir');
var dir = requireDir('./tasks');

gulp.task('build', function (cb) {
    runSequence('clean',
        [
            'public',
            'less',
            'vendor_js',
            'app_js'
        ],
        cb);
});