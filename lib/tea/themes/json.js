/*!
 * tea - json theme
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # json theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function (logger, event) {
  return JSON.stringify(event) + '\n';
};
