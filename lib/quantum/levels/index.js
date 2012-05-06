/*!
 * Quantum - Levels loader
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fs')
  , path = require('path');

/*!
 * For each level, provide getter on export that
 * will lazy-load the level for use.
 */

fs.readdirSync(__dirname)
  .forEach(function (filename) {
    if (!/\.js$/.test(filename)) return;
    if (/index\.js$/.test(filename)) return;
    var name = path.basename(filename, '.js');
    function load () {
      return require('./' + name);
    }
    Object.defineProperty(exports, name, { get: load });
  });
