// // 得到gulp对象
// var gulp = require('gulp');
// var uglify = require('gulp-uglify');
// var htmlmin = require('gulp-htmlmin');
// var cssnano = require('gulp-cssnano');

// //新建任务

// gulp.task('script' , function(){
// 	gulp.src('./src/js/LEN.js')   		//匹配到LEN.js
// 	.pipe(uglify())				//执行什么任务(压缩)
// 	.pipe(gulp.dest('./dist/js'));	//输出到指定目录
// });
// gulp.task('css',function(){
// 	gulp.src('./src/css/index.css')
// 	.pipe(cssnano())
// 	.pipe(gulp.dest('./dist/css'));
// });
// gulp.task('html',function(){
// 	gulp.src('./src/index.html')
// 	.pipe(htmlmin({collapseWhitespace:true}))
// 	.pipe(gulp.dest('./dist'));
// });

// gulp.task('watch',function(){
// 	gulp.watch(['./src/js/*.js'] , ['script']);
// 	gulp.watch(['./src/css/*.css'],['css']);
// 	gulp.watch(['./src/*.html'],['html']);
// });


var gulp = require('gulp');
var html = require('gulp-htmlmin');
var browserSync = require('browser-sync');
gulp.task('html', function () {
    gulp.src('./src/index.html')
        .pipe(html({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    browserSync.init({
        server: './dist',
        files: ['./dist/index.html']
    });
    gulp.watch('./src/index.html', ['html']);
});


