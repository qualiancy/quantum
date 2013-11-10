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

var Entry = require('./frame');
var levels = require('./levels');
var utils = require('./utils');

var DEFAULTS = {
    levels: { min: 0 }
};

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
  this.set(DEFAULTS);
  this.set(opts);
}

Logger.levels = require('./levels');
Logger.stream = require('./streams');
// Logger.serialize = require('./serializers');

/*!
 * Inherit from Drip event emitter.
 */

inherits(Logger, Roundabout);

/*!
 * Facet configuration
 */

facet(Logger.prototype, '_settings');

Logger.prototype.level = function(name) {
  var lvls = {};

  Object.keys(Logger.levels).forEach(function(key) {
    var level = Logger.levels[key];
    lvls[level[0]] = key;
  });

  return lvls[name];
};

/**
 * ### .stream(name, options)
 *
 * Add a stream to the internal transform stack.
 *
 * @param {Function|Object} handle returning stream
 * @return this
 * @api pubic
 */

Logger.prototype.stream = function(name, options) {
  var stream = Logger.stream(name, options);
  this.use(stream);
  return this;
};

Logger.prototype.pipe = function(name, options, _) {
  if ('string' === typeof name) {
    var stream = Logger.stream(name, options);
    return this.pipe(stream, _);
  } else {
    return Roundabout.prototype.pipe.call(this, name, options);
  }
};

/**
 * ### .child(name)
 *
 * Clone current logger's settings to a new logger
 * instance. Items logged to new logger will be
 * piped to current.
 *
 * @param {String} name
 * @return {Logger} piped to current
 */

Logger.prototype.child = function(name) {
  name = name || this.get('name') + '-child';
  var child = new Logger(name);
  child.pipe(this, { end: false });
  return child;
};

Logger.prototype.frame = function(level, msg, meta) {
  if (!this.level(level)) {
    var err = new Error('Invalid log level of "' + level + '".');
    this.emit('error', err);
    return null;
  }

  var frame = new Entry(this.get('name'), this.level(level));
  frame.message(msg);
  frame.meta(meta);
  return frame;
};

Object.keys(Logger.levels).forEach(function(id) {
  var level = Logger.levels[id][0];
  Logger.prototype[level] = function(msg, meta) {
    return this.log(level, msg, meta);
  };
});

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

Logger.prototype.log = function(lvl, msg, meta) {
  var frame = this.frame(lvl, msg, meta);
  if (!frame) return this;
  this.write(frame);
  return this;
};
