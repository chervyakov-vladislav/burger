module.exports = () => {

  $.gulp.task('copy:img', () => {
    return $.gulp.src('./src/img/**/*.*')
      .pipe($.gulp.dest('dist/img'));
  })

}