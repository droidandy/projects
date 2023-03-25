module.exports = {
	js: {
		dest: "./build/www/",
		src: "./src/js/app.js",
		watch: "./src/js/**/*.js"
	},
	scss: {
		dest: "./build/www/",
		src: "./src/scss/**/*.scss",
		watch: "./src/scss/**/*.scss"
	},
	html: {
		dest: "./build/www/",
		src: "./src/html/**/*.html",
		watch: "./src/html/**/*.html"
	},
	images: {
		dest: "./build/www/img/",
		src: "./src/img/**/*.*",
		watch: "./src/img/**/*.*"
	},
	libs: {
		dest: "./build/www/libs/",
		src: "./src/libs/**/*.*"
	}
};