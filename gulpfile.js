const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

const paths = {
    siteVendor: [

    ],
    siteDev: [

    ]
};



gulp.task('app', [], function () {
    return gulp
        .src('site/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(concat('file.js'))
        .pipe(gulp.dest('dist/app'));
});


gulp.task('all', ['vendor', 'dev', 'sass', 'site', 'siteAngularVendorMin', 'siteAngularMin']);

gulp.task('watch', function(){
    gulp.watch(paths.js, ['dev']);
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.wiquotSiteVendorAngular, ['siteAngularVendor']);
    gulp.watch(paths.wiquotSiteAngular, ['siteAngular']);
});