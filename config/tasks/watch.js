module.exports = () => {
	$.gulp.task('watch', () => {
		$.gulp.watch('./src/*.html', $.gulp.series('copy:html'))
      .on('change', $.bSync.reload)
    $.gulp.watch('./src/img/**/*.*', $.gulp.series('copy:img'))
      .on('change', $.bSync.reload)
    $.gulp.watch('./src/fonts/*.*', $.gulp.series('copy:fonts'))
      .on('change', $.bSync.reload)
    $.gulp.watch('./src/js/**/*.*', $.gulp.series('copy:js'))
      .on('change', $.bSync.reload)
			$.gulp.watch('./src/css/**/*.scss', $.gulp.series('scss'))
      .on('change', $.bSync.reload)
	})
}