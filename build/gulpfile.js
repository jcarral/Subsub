const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task("js", function(){
    return browserify({
        entries: ["./script/main.js"]
    })
    .transform(babel.configure({
        presets : ["es2015"]
    }))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("../web/bundles/script"))
    ;
});

gulp.task('styles', function() {
    gulp.src('./css/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('../web/bundles/css/'));
});



gulp.task('default',function() {
    gulp.watch('./script/**/*.js', ['js']);
    gulp.watch('./css/**/*.scss',['styles']);
});
