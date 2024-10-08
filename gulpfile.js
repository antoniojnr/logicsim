const { src, dest, series } = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const htmlreplace = require("gulp-html-replace");

function cleanBuild() {
  return src("public", { allowEmpty: true }).pipe(clean());
}

function scripts() {
  return (
    src("src/**/*.js") // ajuste o caminho para onde estão seus arquivos JS
      .pipe(concat("app.js")) // nome do arquivo concatenado
      // .pipe(dest("public")) // destino do arquivo concatenado
      .pipe(rename({ suffix: ".min" }))
      .pipe(uglify()) // minifica o código
      .pipe(dest("public"))
  ); // salva o arquivo minificado
}

function html() {
  return src("index.html")
    .pipe(
      htmlreplace({
        js: "app.min.js", // Substitui pelo arquivo minificado
      })
    )
    .pipe(dest("public"));
}

function styles() {
  return src("style.css").pipe(dest("public"));
}

// Copia a pasta de libraries
function libraries() {
  return src("libraries/**/*").pipe(dest("public/libraries"));
}

// Tarefa padrão que executa todas as tarefas necessárias
exports.default = series(cleanBuild, scripts, html, styles, libraries);
