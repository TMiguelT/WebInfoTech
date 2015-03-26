'use strict';

var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var $ = require('gulp-load-plugins')();

gulp.task('less', ['clean', 'public'], function() {
    return gulp.src('./app/common/app.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});

