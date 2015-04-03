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
        cb
    );
});

gulp.task('watch', function() {
  	gulp.watch(['./app/app.js','./app/**/*.js'], ['app_js']);
  	gulp.watch(['./app/app.less'], ['less']);  
  	gulp.watch([
  		'./app/**/*',
        '!./app/**/*.less',
        '!./app/index.html',
        '!./app/**/*.js'], 
        ['public']
  	);  
	gulp.watch([
	    './bower_components/jquery/dist/jquery.js',
	    './bower_components/angular/angular.js',
	    './bower_components/ng-lodash/build/ng-lodash.js',
	    './bower_components/lodash/dist/lodash.js',
	    './bower_components/angular-route/angular-route.js',
	    './bower_components/bootstrap/dist/js/bootstrap.js',
	    './bower_components/angular-google-maps/dist/angular-google-maps.js'], 
	    ['vendor_js']
	);  
});

