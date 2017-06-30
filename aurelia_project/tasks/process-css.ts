import * as gulp from 'gulp';
import * as gulpcleancss from 'gulp-clean-css';
import * as gulpsass from 'gulp-sass';
import * as gulpsourcemaps from 'gulp-sourcemaps';
import * as project from '../aurelia.json';

export default function processCSS() {
  return gulp.src("src/styles/splash.scss")
    .pipe(gulpsourcemaps.init(), { loadMaps: true })
    .pipe(gulpsass().on('error', gulpsass.logError))
    .pipe(gulpcleancss())
    .pipe(gulpsourcemaps.write('.', undefined))
    .pipe(gulp.dest("dist/styles"));
};
