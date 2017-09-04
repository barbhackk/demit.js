var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();

gulp.task('build', ['minify-js'], function() {
    
});

gulp.task('dev', ['browser-sync', 'watch'], function(){

});

gulp.task('minify-js', function (cb) {
  pump([
        gulp.src('src/*.js'),
        uglify(),
        gulp.dest('build'),
        browserSync.stream()
    ],
    cb
  )
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        startPath: './index.html'
    });
});

gulp.task('watch', function() {
    gulp.watch('./index.html', browserSync.reload);
    gulp.watch('src/*.js', ['minify-js']);
  });