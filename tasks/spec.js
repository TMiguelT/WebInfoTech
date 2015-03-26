var gulp = require('gulp');
var karma = require('karma').server;

gulp.task('spec', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});