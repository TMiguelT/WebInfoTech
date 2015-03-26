'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('public', ['clean'], function() {
    return gulp.src(['./app/**/*',
        '!./app/**/*.less',
        '!./app/**/*.js'
    ])
        .pipe(gulp.dest('./public'));
});
