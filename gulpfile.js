var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var sass = require('gulp-sass');
//var ignore=require("gulp-ignore");
var uglify = require("gulp-uglify");

var minifyCss = require('gulp-minify-css');
var webserver = require("gulp-webserver");
var htmlmin = require("gulp-htmlmin");

gulp.task('default', ['js', 'sass', "html"]);

// javascript task
gulp.task('js', function () {
    if (process.env.NODE_ENV === 'production') {
        var map = [
            "app.js"
        ].map(function (script) {
            return './assets/javascripts/' + script;
        });

        return gulp.src(map) // path to your files
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./public/js/'));
    } else {
        var map = [
            "app.js"
        ].map(function (script) {
            return './assets/javascripts/' + script;
        });

        return gulp.src(map) // path to your files
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./public/js/'));
    }
});

// stylesheets task
gulp.task('sass', function () {
    //main
    var scss = [
        "app.scss"
    ].map(function (script) {
        return './assets/stylesheets/' + script;
    });

    return gulp.src(scss) // path to your file
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/style/'));
});

// compress html
gulp.task("html", function () {
    return gulp.src("./assets/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./public/"));
});

// gulp.task('watch', function () {
//     gulp.watch(["./assets/javascripts/*.js"], ['map']);
//     gulp.watch(["./assets/stylesheets/*.scss"], ['sass']);
//     gulp.watch(["./assets/*.html"], ['html']);
// });

gulp.task('webserver', ['map', 'sass'], function () {
    gulp.src("./public/").pipe(webserver({
        liveload: true,
        directoryListing: true,
        open: "http://localhost:3313/index.html",
        port: 3312
    }));
});
