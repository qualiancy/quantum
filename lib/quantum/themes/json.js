/*!
 * Quantum - json theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * # json theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, opts, cb) {
  try { var res = JSON.stringify(obj);}
  catch(ex) { return cb(ex);}
  cb(null, res);
};
