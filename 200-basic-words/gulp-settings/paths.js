module.exports = {
	js: {
		dest: "./www/js/bundle",
		src: "./src/js/app.js",
		watch: "./src/js/**/*.js"
	},
	scss: {
		dest: "./www/css",
		src: "./src/css/**/*.css",
		watch: "./src/css/**/*.css"
	},
	html: {
		dest: "./www/",
		src: "./src/html/**/*.html",
		watch: "./src/html/**/*.html"
	},
	images: {
		dest: "./www/img/",
		src: "./src/img/**/*.*",
		watch: "./src/img/**/*.*"
	},
	libs: {
		dest: "./www/libs/",
		src: "./src/libs/**/*.*"
	}
};
