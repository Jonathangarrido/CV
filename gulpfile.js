'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify');


// DESARROLLO
  // Servidor web de desarrollo
    gulp.task('server', function(){
      connect.server({
        root: './dist',
        port: 7878,
        livereload: true
      });
    })
  // Compila los template a html o php
    gulp.task('templates', function() {
      gulp.src('./src/index.jade')
        .pipe(jade({ // jade:html | jadephp: php
          pretty: true, // true: no compress | false: compress
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
    });
  // Preprocesa archivos SASS a CSS y recarga los cambios
    gulp.task('css', function() {
      gulp.src('./src/css/index.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))// compact | compressed
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write())
        .pipe(concat('./main.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
    });
  // Busca errores en el JS y nos los muestra por pantalla
    gulp.task('jshint', function() {
      return gulp.src('./src/js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('./main.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
    });
// PRODUCCION
  // Servidor produccion
    gulp.task('compiled-server', function(){
      connect.server({
        root: './dist',
        port: 7777,
        livereload: true
      });
    })
  // Compila los template a html o php
    gulp.task('compiled-templates', function() {
      gulp.src('./src/*.jade')
        .pipe(jade({ // jade:html | jadephp: php
          pretty: false, // true: no compress | false: compress
        }))
        .pipe(gulp.dest('./dist'));
    });
  // Preprocesa archivos SASS a CSS y recarga los cambios
    gulp.task('compiled-css', function() {
      gulp.src('./src/css/index.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))// compact | compressed
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(concat('./main.min.css'))
        .pipe(gulp.dest('./dist/css/'));
    });
  // Busca errores en el JS y nos los muestra por pantalla
    gulp.task('compiled-js', function() {
      return gulp.src([
        // './src/js/lib/jquery/dist/jquery.min.js',
        // './src/js/lib/bxslider-4/dist/jquery.bxslider.js',
        './src/js/*.js',
        // './src/js/src/analytics.js',
        // './src/js/src/soundcloud.player.api.js',
      ])
        .pipe(uglify())
        .pipe(concat('./main.min.js'))
        .pipe(gulp.dest('./dist/js/'));
    });
  // copiar archivos extras
    // gulp.task('compiled-copy', function() {
    //   gulp.src('./src/fonts/**')
    //     .pipe(gulp.dest('./dist/fonts'));
    //   gulp.src('./src/images/**')
    //     .pipe(gulp.dest('./dist/images'));
    //   gulp.src('./src/php/**')
    //     .pipe(gulp.dest('./dist/php'));
    //   gulp.src('./src/radio/**')
    //     .pipe(gulp.dest('./dist/radio'));
    //   gulp.src('./src/edgeanimate_assets/**')
    //     .pipe(gulp.dest('./dist/edgeanimate_assets'));
    // });
    
gulp.task('watch', function() {
  gulp.watch(['./src/**/*.jade'], ['templates']);
  gulp.watch(['./src/css/**/*.scss'], ['css']);
  gulp.watch(['./src/js/**/*.js', './Gulpfile.js'], ['jshint']);
});
gulp.task('default', ['server','watch']);
gulp.task('compiled', ['compiled-templates','compiled-css','compiled-js','compiled-server']);
