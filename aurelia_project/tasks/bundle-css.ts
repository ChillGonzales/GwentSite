import * as gulp from 'gulp';
import * as gulpcleancss from 'gulp-clean-css';
import * as gulpsass from 'gulp-sass';
import * as gulpsourcemaps from 'gulp-sourcemaps';
import * as project from '../aurelia.json';
import { build } from 'aurelia-cli';

export default function processCSS() {
  return gulp.src([project.cssProcessor.source, "!src/styles/splash.scss"])
    .pipe(gulpsourcemaps.init())
    .pipe(gulpsass().on('error', gulpsass.logError))
    .pipe(gulpcleancss())
    .pipe(build.bundle());
};
