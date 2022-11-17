const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify-es').default;
const imagemin     = require('gulp-imagemin');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const svgSprite    = require('gulp-svg-sprite');
const cheerio      = require('gulp-cheerio');
const replace      = require('gulp-replace');
const fileInclude  = require('gulp-file-include');


const htmlInclude = () => {
  return src(['app/html/*.html']) 
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file',
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}

function svgSprites() {
  return src('app/images/icons/*.svg')
    .pipe(cheerio({
      run: ($) => {
        $("[fill]").removeAttr("fill");
        $("[stroke]").removeAttr("stroke");
        $("[style]").removeAttr("style");
      },
      parserOptions: { xmlMode: true },
    })
    )
    .pipe(replace('&gt;', '>'))  
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('app/images'));
}


function browsersync(){
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
    notify: false
	});
}

function cleanDist(){
	return del('dist')
}

function images(){
	return src('app/images/**/*.*')
	.pipe(imagemin(
	[
	imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
	})
  ]
	))
	.pipe(dest('dist/images'))
}

function scripts(){
	return src([
      'node_modules/jquery/dist/jquery.js',
		'app/js/main.js'
	])
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}


function styles() {
  return src('app/scss/style.scss')
	.pipe(scss({outputStyle: 'compressed'}))
	.pipe(concat('style.min.css'))
	.pipe(autoprefixer({
		overrideBrowerslist: ['last 10 version'],
		grid: true
	}))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}


function build(){
	return src([
  'app/**/*.html',
	'app/css/style.min.css',
  'app/js/main.min.js',
	'app/fonts/**/*'
	],{base: 'app'})
	.pipe(dest('dist'))
}



function watching(){
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload);
  watch(['app/images/icons/*.svg'], svgSprites);
  watch(['app/html/**/*.html'], htmlInclude);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.htmlInclude = htmlInclude;

exports.build = series(cleanDist, images, build);
exports.default = parallel(htmlInclude, svgSprites, styles, scripts, browsersync, watching);