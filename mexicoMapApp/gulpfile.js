const gulp = require("gulp"),
			gutil = require("gulp-util"),
			plumber = require("gulp-plumber"),
			csscomb = require("gulp-csscomb"),
			sass = require("gulp-sass"),
			autoprefixer = require("gulp-autoprefixer"),
			webpack = require("webpack-stream"),
			browserSync = require("browser-sync"),
			paths = require("./gulp-settings/paths.js"),
			webpackConfig = require("./gulp-settings/webpack-config.js"),
			browserSyncConfig = require("./gulp-settings/browsersync-config.js"),
			reload = browserSync.reload;

gulp.task('webserver',  () => {
	browserSync(browserSyncConfig);
});

gulp.task("build:css", () => {
	return gulp.src(paths.scss.src)
			.pipe(plumber())
			.pipe(sass().on("error", sass.logError))
			.pipe(autoprefixer({
				browsers: ["last 15 versions"],
				cascade: false
			}))
			.pipe(csscomb())
			.pipe(gulp.dest(paths.scss.dest))
			.pipe(reload({stream: true}));
});

gulp.task("build:js", () => {
	return gulp.src(paths.js.src)
			.pipe(plumber())
			.pipe(webpack(webpackConfig, null, (err, stats) => {
				if(err) throw new gutil.PluginError("webpack", err);
			}))
			.pipe(gulp.dest(paths.js.dest))
			.pipe(reload({stream: true}));
});

gulp.task("build:html", () => {
	return gulp.src(paths.html.src)
			.pipe(gulp.dest(paths.html.dest))
			.pipe(reload({stream: true}));
});

gulp.task("build:img", () => {
	return gulp.src(paths.images.src)
			.pipe(gulp.dest(paths.images.dest));
});

gulp.task("build:audio", () => {
	return gulp.src(paths.audio.src)
			.pipe(gulp.dest(paths.audio.dest));
});

gulp.task("build:libs", () => {
	return gulp.src(paths.libs.src)
			.pipe(gulp.dest(paths.libs.dest));
});

gulp.task("watch", () => {
	gulp.watch(paths.scss.watch, ["build:css"]);
	gulp.watch(paths.js.watch, ["build:js"]);
	gulp.watch(paths.html.watch, ["build:html"]);
});

gulp.task("default", [
	"build:libs",
	"build:img",
	"build:audio",
	"build:html",
	"build:css",
	"build:js",
	"webserver",
	"watch"
]);