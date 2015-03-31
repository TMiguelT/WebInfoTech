'use strict';

var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var $ = require('gulp-load-plugins')();

gulp.task('less', function() {
    return gulp.src('./app/app.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public'));
});

