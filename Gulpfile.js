"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var requireDir = require('require-dir');
var dir = requireDir('./tasks');

gulp.task('build',
    ['clean',
     'public',
     'less',
     'vendor_js',
     'app_js'
    ]);