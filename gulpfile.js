'use strict';

var env = process.env.NODE_ENV || 'localhost';

var gulp        = require('gulp');
/* html */
var htmlmin     = require('gulp-htmlmin');		// html压缩
/* css */
var sourcemaps  = require('gulp-sourcemaps')
var less        = require('gulp-less');			// less编译
var csso        = require('gulp-csso');			// css压缩
/* js */
const babel     = require('gulp-babel')
var str2hex     = require('gulp-str2hex');		// js压缩混淆
/* 文件操作 */
var clean       = require('gulp-clean');		// 文件清除
/* 工程相关 */
var runSequence = require('gulp-sequence');		// 执行队列
var browserSync = require('browser-sync').create();

var BROWSER_SYNC_RELOAD_DELAY = 2000;

gulp.task('nodemon', function(cb) {
	var called = false;
	return nodemon({
		script: 'bin/www',
		env: {
			NODE_ENV: env
		},
		ignore: ['upload', 'public/**/*.*'],
		ext: '*'
	})
	.on('start', function onStart() {
		if (!called) cb();
		called = true;
	})
	.on('restart', function onRestart() {
		setTimeout(function reload() {
			browserSync.reload({ stream: false });
		}, BROWSER_SYNC_RELOAD_DELAY);
	});
});

gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: {
			target: 'http://localhost:3100',
			ws: true
		},
		files: ['public/**/*.*'],
		browser: 'default',
		port: 4100
	});
});

gulp.task('default', ['build:dev']);

/* 编译LESS */
gulp.task('less:dev', function() {
	var lessSrc = 'public/less/*.less';
	var cssDest = 'dist/public/css';
	// var manifest = gulp.src('./rev-manifest.json');
	return gulp.src(lessSrc)
		.pipe(less())
		.pipe(csso())
		.pipe(gulp.dest(cssDest))
});

gulp.task('less:lo', function() {
	var lessSrc = 'public/less/*.less';
	var cssDest = 'public/css';
	return gulp.src(lessSrc)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(less())
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(cssDest));
});

/* 通用插件js压缩 */
gulp.task('js', function() {
	var jsSrc  = ['dist/**/*.js', '!dist/**/util/**', '!dist/**/lib/**', '!dist/**/aliyun.js'];
	var jsDest = 'dist';
	return gulp.src(jsSrc)
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(str2hex({
			hexall: true,
			placeholdMode: 2,
			compress: true
		}))
		.pipe(gulp.dest(jsDest));
});

/* 模板压缩 */
gulp.task('htmlmin', function() {
	return gulp.src('views/**/*.html')
		.pipe(htmlmin({
			includeAutoGeneratedTags: false,		// 自动插入闭合标签 (handlebars模板引擎必须为false)
			removeComments: true,					// 删除HTML注释
			removeEmptyAttributes: true,			// 删除所有空格作属性值 <input id="" /> ==> <input />
			removeScriptTypeAttributes: true,		// 删除<script>的type="text/javascript"
			removeStyleLinkTypeAttributes: true,	// 删除<style>和<link>的type="text/css"
			collapseWhitespace: true,				// 压缩HTML
			collapseBooleanAttributes: true,		// 省略布尔属性的值 <input checked="true"/> ==> <input />
			minifyJS: true,							// 压缩页面JS
			minifyCSS: true							// 压缩页面CSS
		}))
		.pipe(gulp.dest('dist/views'))
});

/* 复制文件 */
gulp.task('copy', function () {
	var src = ['**', '!node_modules/**', '!demo/**', '!document/**', '!gulpfile.js'];
	var dest = 'dist';
	return gulp.src(src).pipe(gulp.dest(dest));
});

gulp.task('build:localhost', function() {
	env = 'localhost';
	return runSequence(
		'clean:init',	// 初始化清除文件
		'less:lo',		// 编译less
		'clean:end'		// 结束清除文件
	)();
});

gulp.task('build:dev', function() {
	env = 'development';
	return runSequence(
		'clean:init',	// 初始化清除文件
		'copy',
		'js',			// 插件js压缩
		'less:dev',		// 编译less
		'htmlmin',		// 模板压缩
		'clean:end'		// 结束清除文件
	)();
});

gulp.task('clean:init', function () {
	return gulp.src(['dist', 'upload/*'], {read: false}).pipe(clean());
});

gulp.task('clean:end', function () {
	return gulp.src(['dist/node_modules', 'dist/demo', 'dist/document'], {read: false}).pipe(clean());
});