const $ = require('gulp-load-plugins')()
const autoprefixer = require('autoprefixer')
const browsersync = require('browser-sync').create()
const gulp = require('gulp')
const mqpacker = require('css-mqpacker')
const path = require('path')
const pmr = require('postcss-merge-rules')
const poststylus = require('poststylus')
const reporter = require('postcss-reporter')

// ------------------------------------------------------------

gulp.task('default', ['watch'], function () {})
gulp.task('build', ['stylus'], function () {})

// ------------------------------------------------------------

gulp.task('stylus', function () {
  const src = 'stylus/**/[!_]*.styl'
  const dest = 'redaxo.docset/Contents/Resources/Assets/css'
  return gulp
    .src(src)
    .pipe($.plumber())
    .pipe($.sort())
    .pipe(
      $.stylus({
        compress: false,
        use: [
          poststylus([
            pmr(),
            mqpacker(),
            autoprefixer({
              browsers: ['last 2 versions']
            }),
            reporter()
          ])
        ],
        import: [
          path.join(__dirname, 'stylus/_settings.styl'),
          path.join(__dirname, 'stylus/_functions.styl')
        ]
      })
    )
    .pipe($.concat('styles.css'))
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream())
})

// ------------------------------------------------------------

gulp.task('watch', ['stylus'], function () {
  browsersync.init({
    server: {
      baseDir: './',
      directory: true
    }
  })
  gulp.watch('stylus/**/*.styl', ['stylus'])
  gulp
    .watch(['*.html', 'redaxo.docset/Contents/Resources/Assets/js/*.js']
      , function () {})
    .on('change', browsersync.reload)
})
