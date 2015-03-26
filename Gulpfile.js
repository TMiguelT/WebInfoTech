"use strict";

var gulp = require('gulp');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();

var requireDir = require('require-dir');
var dir = requireDir('./tasks');

gulp.task('clean', require('del').bind(null, ['.tmp', 'public']));

gulp.task('build',
    ['clean',
     'public',
     'less']);