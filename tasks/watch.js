var vendor = require('./vendor.json');
var gulp = require('gulp');

gulp.task('watch', function() {
    gulp.watch(['./app/app.js','./app/**/*.js'], ['app_js']);
    gulp.watch(['./app/app.less', './app/**/*.less'], ['less']);
    gulp.watch([
            './app/**/*',
            '!./app/**/*.less',
            '!./app/index.html',
            '!./app/**/*.js'],
        ['public']
    );
    gulp.watch(vendor);
});