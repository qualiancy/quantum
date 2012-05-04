/*!
 * tea - Levels loader
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
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

fs.readdirSync(__dirname + '/levels')
  .forEach(function (filename) {
    if (!/\.js$/.test(filename)) return;
    var name = path.basename(filename, '.js');
    function load () {
      return require('./levels/' + name);
    }
    Object.defineProperty(exports, name, { get: load });
  });
