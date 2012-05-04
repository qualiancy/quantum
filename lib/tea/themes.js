/*!
 * tea - Themes loader
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fs')
  , path = require('path');

/*!
 * For each theme, provide getter on export that
 * will lazy-load the theme for used.
 */

fs.readdirSync(__dirname + '/themes')
  .forEach(function (filename) {
    if (!/\.js$/.test(filename)) return;
    var name = path.basename(filename, '.js');
    function load () {
      return require('./themes/' + name);
    }
    Object.defineProperty(exports, name, { get: load });
  });
