var gulp =       require('gulp');
var uglify =     require('gulp-uglify');
var jshint =     require('gulp-jshint');
var webpack =    require('gulp-webpack');
var rename =     require('gulp-rename');
var header =     require('gulp-header');
                 require('gulp-grunt')(gulp);

var pkg = require('./package.json');
var banner = [
  '/*!',
  ' * <%= pkg.name %>',
  ' * version <%= pkg.version %>',
  ' * Requires jQuery 1.7.1 or higher',
  ' * <%= pkg.repository.url %>',
  ' * License: Grocery Shopping Network',
  ' *          MIT from derived work of Copyright (c) 2013 Matt Cooper: https://github.com/coop182/jquery.dfp.js  v1.0.18',
  ' */\n'
].join('\n');

gulp.task('default', function() {
  return gulp.src('src/gsndfp.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(webpack({
      output: {
        libraryTarget: 'umd'
      },
      externals: {
        'jquery': {
          commonjs: 'jquery',
          commonjs2: 'jquery',
          amd: 'jquery',
          root: 'jQuery'
        }
      }
    }))
    .pipe(rename('gsndfp.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/gsndfp.js', ['default']);
});

gulp.task('test', ['grunt-jasmine']);
