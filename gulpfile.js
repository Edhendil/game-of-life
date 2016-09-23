var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bowerFiles = require('gulp-main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var wrapIife = require('gulp-wrap-iife');
var filter = require('gulp-filter');
var cleanCss = require('gulp-clean-css');
var flatten = require('gulp-flatten');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var jscs = require("gulp-jscs");
var prettify = require("gulp-jsbeautifier");
var serve = require('gulp-serve');

// config
var destFolder = 'dist';
var destCss = destFolder + '/css';
var destJs = destFolder + '/js';
var destFonts = destFolder + '/fonts';
var destImage = destFolder + '/img';

//Lint Task
gulp.task('lint', function() {
    return gulp.src(['client/**/*.js', '!client/**/*.spec.js'])
        .pipe(jshint("jshint.json"))
        .pipe(jshint.reporter('default'));
});

//Concatenate & Minify Empresa JS
gulp.task('gameJs', function() {
    return gulp.src(['client/app/app.module.js', 'client/**/*.js', '!client/**/*.spec.js'])
        .pipe(sourcemaps.init())
        .pipe(wrapIife())
        .pipe(ngAnnotate())
        .pipe(concat('gameOfLife.js'))
        .pipe(gulp.dest(destJs))
        .pipe(rename('gameOfLife.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destJs));
});

//Concatenate & Minify Empresa CSS
gulp.task('gameCss', function() {
    return gulp.src('client/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('gameOfLife.css'))
        .pipe(gulp.dest(destCss))
        .pipe(rename('gameOfLife.min.css'))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destCss));
});

//Concatenate & Minify JS libraries
gulp.task('vendorJs', function() {

    var filterJS = filter('**/*.js');

    return gulp.src('./bower.json')
        .pipe(bowerFiles())
        .pipe(filterJS)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(destJs))
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destJs));
});

//Concatenate & Minify CSS libraries
gulp.task('vendorCss', function() {

    var filterCSS = filter('**/*.css');

    return gulp.src('./bower.json')
        .pipe(bowerFiles())
        .pipe(filterCSS)
        // .pipe(sourcemaps.init())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(destCss))
        .pipe(rename('libs.min.css'))
        .pipe(cleanCss())
        // .pipe(sourcemaps.write(destCss))
        .pipe(gulp.dest(destCss));
});

gulp.task('fonts', function() {

    var fontFiles = ['bower_components/bootstrap/fonts/*.*', 
                     'bower_components/components-font-awesome/fonts/*.*', 
                     'bower_components/simple-line-icons/fonts/*.*'];
    
    return gulp.src(fontFiles)
        .pipe(flatten())
        .pipe(gulp.dest(destFonts));
    
});

gulp.task('views', function() {

    var viewFiles = 'client/index.html';
    
    return gulp.src(viewFiles)
        .pipe(gulp.dest(destFolder));
    
});

gulp.task('images', function() {
    return gulp.src('client/images/**/*.*')
        .pipe(gulp.dest(destImage));
});

gulp.task('clean', function() {
    return del([destFolder + '/**', '!' + destFolder]);
});

gulp.task('html2js', function() {
    return gulp.src('client/app/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "templates",
            strip: "client/app"
        }))
        .pipe(concat("templates.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(destJs));
}) ;

gulp.task('formatJs', function() {
    return gulp.src('client/app/**/*.js')
        .pipe(prettify({config: 'jsbeautifier.json'}))
        .pipe(gulp.dest('client/app/'))
        .pipe(jscs({configPath: 'jscs.json'}))
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'));
});

//Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['client/app/**/*.js', '!client/**/*.spec.js'], ['gameJs']);
    gulp.watch('client/**/*.spec.js', ['gameJsTest']);
    gulp.watch('client/**/*.css', ['gameCss']);
    gulp.watch('client/app/**/*.html', ['html2js']);
    gulp.watch('client/images/**/*.*', ['images']);
});

gulp.task('serve', serve('dist'));

gulp.task('rebuild', ['gameJs' , 'vendorJs', 'gameCss', 'vendorCss', 'fonts', 'views', 'images', 'html2js']);

gulp.task('compile', ['gameJs' , 'gameCss', 'fonts', 'views', 'images', 'html2js']);

