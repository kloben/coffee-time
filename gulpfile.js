const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const del = require('del');

const tsc = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

var runSequence = require('run-sequence');
var systemBuilder = require('systemjs-builder');



const paths = {
    siteVendorJs: [
        "node_modules/zone.js/dist/zone.js",
        "node_modules/reflect-metadata/Reflect.js",
        "node_modules/systemjs/dist/system.src.js",
        "build/site.bundle.js"
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

gulp.task('bundle', function () {
    var builder = new systemBuilder('./build', {
        paths: {
            'npm:': './node_modules/',
            '*': '*.js'
        },
        meta: {
            '@angular/*': {
                build: false
            },
            'rxjs/*': {
                build: false
            }
        },
        map: {
            // our app is within the app folder
            app: 'site',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs':                      'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
            'socket.io-client': 'npm:socket.io-client/socket.io.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'angular-in-memory-web-api': {
                main: './index.js',
                defaultExtension: 'js'
            }
        }
    });

    return builder.bundle('main', 'build/site.bundle.js');
});

gulp.task('prependWithVendor', function(){
   return gulp.src(paths.siteVendorJs)
       .pipe(concat('site-all.js'))
       .pipe(gulp.dest('dist/js'));
});


gulp.task('concat', function () {
    return gulp
        .src(paths.siteJs)
        .pipe(concat('build.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('cleanDist', function () {
    return del('dist/js/*');
});

gulp.task('cleanBuild', function () {
    return del('build/*');
});

gulp.task('sass', function () {
    return gulp
        .src(paths.sass)
        .pipe(concat('coffe-time.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});







gulp.task('build', function(done) {
    runSequence('cleanBuild','cleanDist', 'tsc', 'bundle', 'prependWithVendor', 'sass');
});

gulp.task('watch', function(){
    gulp.watch(paths.devJs, ['build']);
});