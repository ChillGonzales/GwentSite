import * as project from '../aurelia.json';
import { build, CLIOptions } from 'aurelia-cli';
import * as gulp from 'gulp';
import * as gulpUtil from 'gulp-util';
import transpile from './transpile';
import processMarkup from './process-markup';
import copyFiles from './copy-files';
import bundleCss from './bundle-css';
import processCSS from './process-css';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    copyFiles,
    bundleCss,
    processCSS
  ),
  writeBundles
);

function readProjectConfiguration() {
  let env = CLIOptions.getEnvironment();
  gulpUtil.log("Building project for " + env);
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
