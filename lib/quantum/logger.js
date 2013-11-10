/*!
 * Quantum - Logger
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var facet = require('facet');
var inherits = require('util').inherits;
var Roundabout = require('roundabout');

/*!
 * Internal modules
 */

var utils = require('./utils');

/*!
 * Main export
 */

module.exports = Logger;

/**
 * # Logger (constructor)
 *
 * Creates a new logger instance with the given options.
 *
 *      var log = new Logger('my-app', { levels: 'syslog' });
 *
 * Options
 * - levels: specify the log level template to use
 *
 * @param {String} name (recommended)
 * @param {Object} level set
 * @api public
 */

function Logger(name, opts) {
  if (!(this instanceof Logger)) return new Logger(ns, opts);
  Roundabout.call(this, { objectMode: true, highWaterMark: 1 });

  if ('string' !== typeof name) {
    opts = name || {};
    name = ops.name || 'log';
  }

  this.set('name', name);

  // handle levels
  this._levelset = utils.levelsets(opts.levels);
  this._levelset.mount(this);
}

/*!
 * Inherit from Drip event emitter.
 */

inherits(Logger, Roundabout);

/*!
 * Facet configuration
 */

facet(Logger.prototype, '_settings');

/**
 * ### .use(fn)
 *
 * Add a stream to the internal transform stack.
 *
 * @param {Function|Object} handle returning stream
 * @return this
 * @api pubic
 */

Logger.prototype.use = function(fn) {
  if (fn.handle && 'function' === typeof fn.handle) {
    fn = fn.handle;
  }

  return Roundabout.prototype.use.call(this, fn(this));
};

/**
 * ### clone(name)
 *
 * Clone current logger's settings to a new logger
 * instance. Items logged to new logger will be
 * piped to current.
 *
 * @param {String} name
 * @return {Logger} piped to current
 */

Logger.prototype.clone = function(name) {
  name = name || this.get('name') + '-clone';
  var clone = new Logger(name, { levels: this._levelset });
  clone.pipe(this, { end: false });
  return clone;
};

/**
 * # log(level, message, [data])
 *
 * General purpose logging function that accepts the
 * log level, message, and optional data JSON object.
 *
 * @param {String} level
 * @param {String} message
 * @param {Object} meta (optional)
 * @api public
 */

Logger.prototype.log = function(type, msg, meta) {
  if (!this._levelset.byName(type)) {
    var err = new Error('Invalid log type of "' + type + '".');
    return this.emit('error', err);
  }

  var ev = {}
  ev.name = this.get('name');
  ev.ts = new Date();
  ev.type = type;
  ev.levels = this._levelset.name;
  ev.meta = meta || {};
  ev.msg = utils.parseValues(msg, ev.meta);

  this.write(ev);
  return this;
};
