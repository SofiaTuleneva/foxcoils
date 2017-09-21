/******************************
 * Load Node Modules/Plugins
 ******************************/

import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import order from 'gulp-order';
import mainBowerFiles from 'main-bower-files';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import handlebars from 'gulp-compile-handlebars';
import path from 'path';
import templateData from './app/data/data.json';
import cleanCSS from 'gulp-clean-css';

let reload = browserSync.reload;
let bowerFiles = mainBowerFiles();

let params = {
	out: 'build',
	less: ['app/less/*.less', 'app/less/partials/*.less', 'app/less/partials/**/*.less'],
	scripts: 'app/js/*.js',
	images: 'assets/images/**/*',
	fonts: 'assets/fonts/**/*'
};

/******************************
 * Default task
 ******************************/

gulp.task('default', [
	'server',
	'build'
]);

/******************************
 * Server task
 ******************************/

gulp.task('server', () => {
	browserSync.init({
		server: params.out
	});
    gulp.watch('app/templates/**/*.handlebars', ['handlebars']);
    gulp.watch(params.less, ['less']);
    gulp.watch(params.scripts, ['scripts']);
	gulp.watch(params.images, ['images']);
	gulp.watch(params.fonts, ['fonts']);
});

/******************************
 * Build task
 ******************************/

gulp.task('build', ['handlebars', 'less', 'scripts', 'images', 'fonts']);

/******************************
 * Handlebars build
 ******************************/
gulp.task('handlebars', () => {
    templateData.timestamp = + new Date();
    return gulp.src('app/templates/*.handlebars')
        .pipe(handlebars(templateData, {
            ignorePartials: true, //ignores the unknown partials
            partials: {
                footer: '<footer>the end</footer>'
            },
            batch: ['./app/templates/blocks'],
            helpers: {
                capitals: function (str) {
                    return str.fn(this).toUpperCase();
                }
            }
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./build'))
        .pipe(reload({stream: true}));
});


/******************************
 * Less build
 ******************************/
gulp.task('less', function () {
	return gulp.src('app/less/app.less')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(less({
			paths: [
				path.join('app/less/partials/*.less', 'less', 'includes'),
				path.join('app/less/partials/**/*.less', 'less', 'includes')
			]
		}))
		.on('error', notify.onError(function (error) {
			return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
		}))
        .pipe(cleanCSS({
            debug: true
        }, (details) => {
            let stats = details.stats;
            let input = stats.originalSize / 1000;
            let output = stats.minifiedSize / 1000;
            let efficiency = stats.efficiency * 100
            console.log(`
File name:  ${details.name}
Before:     ${input} kB
After:      ${output} kB
Time spent: ${stats.timeSpent} ms
Efficiency: ${efficiency}%
			`);
        }))
		.pipe(concat('app.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(params.out + '/css'))
		.pipe(reload({stream: true}));
});

// /******************************
//  * JS plugins build
//  ******************************/
// gulp.task('jsBowerPlugins', () => {
// 	return gulp.src(bowerFiles)
// 		.pipe(sourcemaps.init())
// 		.pipe(concat('bower.plugins.js'))
// 		// .pipe(uglify())
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(params.out + '/js'));
// });

/******************************
 * JS build
 ******************************/
gulp.task('scripts', () => {
	return gulp.src(params.scripts)
		.pipe(sourcemaps.init())
		// .pipe(uglify())
		.pipe(order([
            "jquery.min.js",
            "bootstrap.min.js",
            "*.js"
		]))
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(params.out + '/js'));
});

/******************************
 * Images build
 ******************************/
gulp.task('images', () => {
	return gulp.src(params.images)
		.pipe(gulp.dest(params.out + '/images'))
		.pipe(reload({stream: true}));
});

/******************************
 * Fonts build
 ******************************/
gulp.task('fonts', () => {
	return gulp.src(params.fonts)
		.pipe(gulp.dest(params.out + '/fonts'))
		.pipe(reload({stream: true}));
});