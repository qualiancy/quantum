var fs = require('fs')
  , path = require('path');

var exports = module.exports = {};

fs.readdirSync(__dirname + '/levels').forEach(function (filename) {
  if (!/\.js$/.test(filename)) return;
  var name = path.basename(filename, '.js');
  function load () {
    return require('./levels/' + name);
  }
  console.log(name);
  Object.defineProperty(exports, name, { get: load });
});
