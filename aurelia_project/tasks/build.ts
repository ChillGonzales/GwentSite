import * as project from '../aurelia.json';
import * as gulp from 'gulp';
import * as vinylPaths from 'vinyl-paths';
import * as del from 'del';
import buildSystem from './build-system';

export default gulp.series(
  clean,
  buildSystem
);

function clean() {
  return gulp.src(project.build.targets[0].output + '/**/*.*')
    .pipe(vinylPaths(del));
}
