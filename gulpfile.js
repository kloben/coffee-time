const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const del = require('del');

const tsc = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

var runSequence = require('run-sequence');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

//var transform = require('vinyl-transform');




const paths = {
    vendorJs: [
        "node_modules/zone.js/dist/zone.js",
        "node_modules/reflect-metadata/Reflect.js",
        "build/full-build.js"
    ],
    sass:[
        './sass/main.scss'
    ],
    devJs:[
        './site/*.ts'
    ]
};



gulp.task('tsc', function () {
    return gulp
        .src(paths.devJs)
        .pipe(tsc(tscConfig.compilerOptions))
        .pipe(gulp.dest('./build'));
});

gulp.task('browserify', function () {
    var bundleStream = browserify('./build/main.js').bundle();

    bundleStream
        .pipe(source('./build/main.js'))
        .pipe(streamify(rename('full-build.js')))
        .pipe(gulp.dest('./build'));
});

gulp.task('mergeVendor', function(){
   return gulp.src(paths.vendorJs)
       .pipe(concat('site-all.js'))
       .pipe(gulp.dest('dist/js'));
});


gulp.task('cleanJs', function () {
    del('dist/js/*');
    del('build/*');
});

gulp.task('cleanCss', function () {
    del('dist/css/*');
});

gulp.task('sass', function () {
    return gulp
        .src(paths.sass)
        .pipe(concat('coffe-time.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});







gulp.task('build', function(done) {
    runSequence('cleanJs', 'tsc', 'browserify', 'cleanCss', 'sass');
});

gulp.task('watch', function(){
    gulp.watch(paths.devJs, ['build']);
});