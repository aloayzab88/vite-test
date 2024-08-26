import gulp from 'gulp';
import webp from 'gulp-webp';
import newer from 'gulp-newer';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import cheerio from 'gulp-cheerio';

const paths = {
    images: {
        src: 'src/assets/images/**/*.{png,jpg}',
        dest: 'src/assets/images/'
    },
    svgs: {
        src: 'src/assets/images/**/*.svg',
        dest: 'src/assets/images/'
    },
    svgIcons: {
        src: 'src/assets/icons/**/*.svg',
        dest: 'src/assets/images/'
    }
};

export function toWebp() {
    return gulp.src(paths.images.src, { encoding: false })
        .pipe(newer({
            dest: paths.images.dest,
            ext: '.webp'
        }))
        .pipe(webp({
            alphaQuality: 85,
            quality: 85
        }))
        .pipe(gulp.dest(paths.images.dest));
}

export function svgs() {
    return gulp.src(paths.svgs.src)
        .pipe(newer(paths.svgs.dest))
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svgs.dest));
}

export function icons() {
    return gulp.src(paths.svgIcons.src)
        .pipe(svgmin({
            plugins: [
                {
                    removeViewBox: false
                }
            ]
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(rename('icons.svg'))
        .pipe(gulp.dest(paths.svgIcons.dest));
}

export function watchFiles() {
    gulp.watch(paths.images.src, toWebp);
    gulp.watch(paths.svgs.src, svgs);
    gulp.watch(paths.svgIcons.src, icons);
}

export default gulp.series(
    gulp.parallel(toWebp, icons),
    watchFiles
);