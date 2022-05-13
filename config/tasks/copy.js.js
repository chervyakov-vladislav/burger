module.exports = () => {

  $.gulp.task('copy:js', () => {
    return $.gulp.src('./src/js/**/*.js')
			.pipe($.glp.if($.dev, $.glp.sourcemaps.init()))
			.pipe($.glp.concat('main.js', {newLine: ";"}))
			// .pipe($.glp.babel({
			// 		presets: ['@babel/env']
			// 	})
			// )
			.pipe($.glp.if(!$.dev, $.glp.uglify()))
			.pipe($.glp.if(!$.dev, $.glp.rename({suffix: '.min'})))
			.pipe($.glp.if($.dev, $.glp.sourcemaps.write()))
      .pipe($.gulp.dest('dist/js'));
  })

}