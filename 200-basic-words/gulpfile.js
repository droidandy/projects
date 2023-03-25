var gulp = require("gulp"),
    gutil = require("gulp-util"),//error handling
    plumber = require("gulp-plumber"),//error handling
    csscomb = require('gulp-csscomb'),//css handling
    sass = require('gulp-sass'),//css handling
    autoprefixer = require('gulp-autoprefixer'),//css handling
    paths = require("./gulp-settings/paths"),//paths
    webpack = require("gulp-webpack"),//js handling
    browserSync = require("browser-sync"),
    concatCss = require('gulp-concat-css'),
    reload = browserSync.reload;

var browserSyncConfig = {
    server: {
      baseDir: "./www"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

gulp.task('webserver', function () {
    browserSync(browserSyncConfig);
});

gulp.task("build:css", function() {
    return gulp.src(paths.scss.src)
        .pipe(autoprefixer({
            browsers: ["last 15 versions"],
            cascade: false
        }))
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(reload({stream: true}));
});

gulp.task("build:js", function() {
    return gulp.src(paths.js.src)
        .pipe(webpack({
            output: {
                filename: "bundle.js"
            },
            devtool: "#inline-source-map",
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}]
            }
        }, null, function(err, stats) {
            if(err) {
                throw new gutil.PluginError("webpack", err);
            }
        }))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(reload({stream: true}));
});

gulp.task("build:html", function() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(reload({stream: true}));
});

gulp.task("build:img", function() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task("build:libs", () => {
    return gulp.src(paths.libs.src)
        .pipe(gulp.dest(paths.libs.dest));
});

gulp.task("watch", function() {
    gulp.watch(paths.scss.watch, ["build:css"]);
    gulp.watch(paths.js.watch, ["build:js"]);
    gulp.watch(paths.html.watch, ["build:html"]);
});

gulp.task("parseDict", function () {
  var xlsx = require("xlsx-to-json");
  xlsx({
    input: "./src/dictionary.xlsx",
    output: "dictionary.json"
  }, function(err, result) {
    if(err) {
      console.error('Error during parsing dictionary: ', err);
    } else {
      console.log('Dictionary successfully parsed');
    }
  });
});

gulp.task("default", [
    "build:libs",
    "build:img",
    "build:html",
    "build:css",
    "build:js",
    "webserver",
    "watch"
]);
