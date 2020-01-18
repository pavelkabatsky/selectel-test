const gulp = require('gulp'),
    pug = require('gulp-pug'),
    stylus = require('gulp-stylus'),
    minCSS = require('gulp-cssmin'),
    svgmin = require('gulp-svgmin'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create();


gulp.task('js', function(done) {
    return browserify('./site/prod/src/js/index.js')
        .transform("babelify", {presets: ['@babel/preset-env']})
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./site/dist/js/'));    
});

gulp.task('pug', function (done) {
    gulp.src('./site/prod/*.pug')
    
        .pipe(pug({
            'pretty': true
        }))
        .pipe(gulp.dest('./site/dist'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('stylus', function (done) {
    gulp.src('./site/prod/src/css/*.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./site/dist/css'))
        .pipe(browserSync.stream());
    done();
});

gulp.task('minCSS', function (done) {
    gulp.src('./site/prod/src/css/*.css')
        .pipe(minCSS())
        .pipe(gulp.dest('./site/dist/css'))
    done();
})

gulp.task('minSVG', function (done) {
    gulp.src('./site/prod/src/img/icons/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('./site/dist/image/'));
    done();
});

gulp.task('imagemin', function (done) {
    gulp.src('./site/prod/src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./site/dist/image/'));
    done();
});

// gulp.task('uglify', function(done) {
//     gulp.src('./site/prod/src/js/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['@babel/preset-env']
//         }))
//         .pipe(uglify())
//         .pipe(sourcemaps.write('maps'))
//         .pipe(gulp.dest('./site/dist/js'));
//     done();
// });

gulp.task('serve', function (done) {

    browserSync.init({
        server: "./site/dist"
    });

    gulp.watch("./site/prod/src/stylus/main.styl", gulp.series('stylus'));
    gulp.watch("./site/prod/src/blocks/**/*.styl", gulp.series('stylus'));
    gulp.watch("./site/prod/src/css/*.css", gulp.series('minCSS'));
    gulp.watch("./site/prod/src/icons/*.svg", gulp.series('minSVG'));
    gulp.watch("./site/prod/src/img/*", gulp.series('imagemin'));
    gulp.watch("./site/prod/src/js/*.js", gulp.series('js'));
    gulp.watch("./site/prod/index.pug", gulp.series('pug'));
    gulp.watch("./dist/*.html").on('change', browserSync.reload);

    done();
});

gulp.task('default', gulp.series('pug', 'stylus', 'minCSS', 'minSVG','js', 'imagemin', 'serve'));



