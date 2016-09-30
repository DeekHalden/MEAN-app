var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del'),
    gutil = require('gulp-util');



// create a default task and just log a message
gulp.task('default',['pre-img','pre-js', 'pre-css'], ()=> {
   gutil.log('Gulp is running!')
});


// gulp.task('copyHtml', ()=> {
//   // copy any html files in source/ to public/
//   gulp.src('public/*.html').pipe(gulp.dest('dist'));
// });

gulp.task('pre-img', ()=> {
  // copy any html files in source/ to public/
	gulp.src(['public/images/','public/**/*.html'])
		.pipe(gulp.dest('public_pre/')),

	del(['public_pre/images']),

	gulp.src('public/images/**/*')
  		.pipe(cache(imagemin({optimizationLevel:3, progressive:true, interlaced:true})))
  		.pipe(gulp.dest('public_pre/images'))
  		.pipe(notify({message: 'Well done'}));
});





gulp.task('pre-js',()=> {
	gulp.src('public/javascripts/**/*.js')
		// .pipe(concat('bundle.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public_pre/javascripts'));
})

gulp.task('pre-css',()=>{
	gulp.src('public/stylesheets/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('public_pre/stylesheets'));

})

// gulp.task('usemin', ()=> {
//   gulp.src('public/**/*.{css,js}*')
//       .pipe(usemin({
//         css:[minifycss(),rev()],
//         js: [ngannotate(),uglify(),rev()]
//       }))
//       .pipe(gulp.dest('public_pre/'));
// });
