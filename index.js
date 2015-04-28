var less = require('less');
var sysPath = require('path');
var progeny = require('progeny');

function LESSCompiler(config) {
  if (config == null) config = {};
  if (config.plugins == null) config.plugins = {};

  this.config = config.plugins.less || {};

  this.rootPath = this.config.paths.root;
  console.log(this.rootPath);
  this.optimize = config.optimize;
  this.getDependencies = progeny({rootPath: this.rootPath, reverseArgs: true});
}

LESSCompiler.prototype.brunchPlugin = true;
LESSCompiler.prototype.type = 'stylesheet';
LESSCompiler.prototype.extension = 'less';

LESSCompiler.prototype.compile = function(params, callback) {
  var data = params.data;
  var path = params.path;
  
  if (path.indexOf(this.rootPath) != 0) {
    return callback(null, null);
  }
  
  less.render(data, {
    paths: [this.rootPath],
    filename: path,
    dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers
  }, function(error, output) {
    if (error != null) {
      var err;
      err = '' + error.type + 'Error:' + error.message;
      if (error.filename) {
        err += ' in "' + error.filename + ':' + error.line + ':' + error.column + '"';
      }
      return callback(err);
    }
    return callback(error, {
      data: output.css
    });
  });
};

module.exports = LESSCompiler;
