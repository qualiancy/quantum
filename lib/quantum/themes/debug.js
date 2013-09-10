/*!
 * Quantum - debug theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect = require('tea-objdisplay')('cdir');

/**
 * # default theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, opts, cb) {
  var res = inspect(obj);
  cb(null ,res);
};
