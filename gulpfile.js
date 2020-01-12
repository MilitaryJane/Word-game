'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require("gulp-concat");
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const del = require('del');
const cssNano = require('gulp-cssnano');
const rename = require('gulp-rename');
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const ghPages = require('gh-pages');
const path = require('path');
const webpack = require('webpack-stream');

let isDev = true;
let isProd = !isDev;

let webConfig = {
    output: {
        filename: 'main.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                    //   plugins: ['@babel/plugin-transform-runtime']
                    }
                },
                exclude: '/node_modules/'
            }
        ]
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'none'
};

gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(concat('styles.scss'))
        .pipe(sass())
        .pipe(autoprefixer([
            'last 10 versions'
        ], {
            cascade: true
        }))

        .pipe(gulp.dest('src/css'))
        .pipe(cssNano())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('src/css'))

        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
});

gulp.task('images', function () {
    return gulp.src(['src/img/**/*.{jpg,jpeg,png,svg}', '!src/img/sprite.svg'])
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('src/img'));
});


gulp.task('webp', function () {
    return gulp.src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(webp({
            quality: 90
        }))
        .pipe(gulp.dest('src/img'));
})

gulp.task('sprite', function () {
    return gulp.src('src/img/**/sprite-*.svg')
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest('src/img'));
});




gulp.task('scripts-libs', function () {
    return gulp.src(['src/libs/picturefill/dist/*.min.js',
            'src/libs/svg4everybody/dist/*.min.js',
        ])
        .pipe(gulp.dest('src/js'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/js/**/*.js', '!src/js/*.min.js'])
        .pipe(webpack(webConfig))
        .pipe(gulp.dest('src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))

});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.{scss,sass}', gulp.parallel('sass'));
    gulp.watch(['src/js/**/*.js', '!src/js/*.min.js'], gulp.parallel('scripts'))
    gulp.watch('src/*.html', gulp.parallel('html'));
})



gulp.task('clean', function () {
    return del('dist');
});



gulp.task('prebuild', async function () {
    var buildCss = gulp.src([
            'src/css/styles.css',
            'src/css/styles.min.css',
            'src/css/normalize.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildImage = gulp.src('src/img/**/*.{jpg,jpeg,png,svg,webp}')
        .pipe(gulp.dest('dist/img'))

    var buildFonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('src/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest("dist"));


})


gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch', 'scripts-libs', 'images', 'scripts'));
gulp.task('build', gulp.series('clean', 'sass', 'scripts-libs', 'images', 'scripts', 'prebuild'));


function deploy(cb) {
    ghPages.publish(path.join(process.cwd(), './dist'), cb);
}
exports.deploy = deploy;
