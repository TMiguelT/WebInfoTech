'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('public', function() {
    return gulp.src(['./app/**/*',
        '!./app/**/*.less',
        '!./app/index.html',
        '!./app/**/*.js'
    ])
        .pipe(gulp.dest('./public'));
});
