const $ = require('gulp-load-plugins')()
const autoprefixer = require('autoprefixer')
const browsersync = require('browser-sync').create()
const gulp = require('gulp')
const mqpacker = require('css-mqpacker')
const path = require('path')
const pmr = require('postcss-merge-rules')
const poststylus = require('poststylus')
const pump = require('pump')
const reporter = require('postcss-reporter')

// ------------------------------------------------------------

function reload (done) {
  browsersync.reload()
  done()
}

function serve (done) {
  browsersync.init({
    open: false,
    server: {
      baseDir: path.join(__dirname, 'redaxo.docset/Contents/Resources'),
      directory: true
    }
  })
  done()
}

// ------------------------------------------------------------

function stylus (done) {
  const src = 'stylus/**/[!_]*.styl'
  const dest = 'redaxo.docset/Contents/Resources/Assets/css'
  pump(
    [
      gulp.src(src),
      $.plumber(),
      $.sort(),
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
      }),
      $.concat('styles.css'),
      gulp.dest(dest),
      browsersync.stream()
    ], done)
}

// ------------------------------------------------------------

function watch () {
  gulp.watch(
    'stylus/**/*.styl',
    gulp.series(stylus, reload)
  )
  gulp.watch(
    'redaxo.docset/Contents/Resources/Assets/**/*.*',
    reload
  )
}

// ------------------------------------------------------------

export const build = gulp.series(
  stylus
)

export const dev = gulp.series(
  stylus,
  serve,
  watch
)

export default dev
