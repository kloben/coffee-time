const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

const paths = {
    siteVendor: [

    ],
    siteDev: [

    ],
    sass:[
        './sass/main.scss'
    ]
};



gulp.task('app', function () {
    return gulp
        .src('site/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(concat('file.js'))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('sass', function () {
    return gulp
        .src(paths.sass)
        .pipe(concat('coffe-time.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('all', ['app', 'sass']);

gulp.task('watch', function(){
    gulp.watch(paths.sass, ['sass']);
});