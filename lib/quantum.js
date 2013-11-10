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

var Frame = require('./quantum/frame');
var utils = require('./quantum/utils');

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
  if (!(this instanceof Logger)) return new Logger(name, opts);
  Roundabout.call(this, { objectMode: true, highWaterMark: 1 });

  if ('string' !== typeof name) {
    opts = name || {};
    name = ops.name || 'log';
  }

  this.set('name', name);
  this.set(opts || {});
}

/*!
 * Export version
 */

Logger.version = '0.4.0';

/**
 * #### .levels
 *
 * View the available level definitions for all
 * logger instances. Levels can be added in the format:
 *
 * ```js
 * quantum.levels['25'] = [ 'name', 'color' ];
 * ```
 *
 * Then an item can be logged via `log`.
 *
 * ```js
 * logger.log('name', 'message');
 * ```
 *
 * @return {Object}
 * @api public
 */

Logger.levels = require('./quantum/levels');

/**
 * #### .stream(type, options)
 *
 * Create a new stream of the `type` provided. Construct
 * with options.
 *
 * ```js
 * var logFile = quantum.stream('file', join(__dirname, 'logs/app.log'));
 * logger.pipe(logFile);
 * ```
 *
 * Streams created specifically for quantum don't need to be
 * required and created. Just name the module `quantum-stream-type`,
 * where `type` can be passed to this method.
 *
 * @param {String} type
 * @param {Object} options
 * @return {String} writable / transform
 * @api public
 */

Logger.stream = require('./quantum/streams');

// Logger.serialize = require('./serializers');

/*!
 * Inherit from Drip event emitter.
 */

inherits(Logger, Roundabout);

/*!
 * Facet configuration
 */

facet(Logger.prototype, '_settings');

/**
 * ### .level(name)
 *
 * Get the numeric id for stringed level name.
 *
 * @param {String} name
 * @return {Number} id
 * @api public
 */

Logger.prototype.level = function(name) {
  var lvls = {};

  Object.keys(Logger.levels).forEach(function(key) {
    var level = Logger.levels[key];
    lvls[level[0]] = Number(key);
  });

  return lvls[name];
};

/**
 * ### .stream(name, options)
 *
 * Add a stream to the internal transform stack.
 *
 * ```js
 * logger.stream('filter-levels', { gte: 30 });
 * ```
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

/**
 * ### .pipe(name|stream, options|streamOpts, streamOpts)
 *
 * If passed a stream then it will function as `.pipe`
 * usually does. If passed a string then will create that
 * stream from quantums repository of streams. Returns the
 * stream that has been piped to.
 *
 * ```js
 * // normal usage
 * var fd = fs.createWriteStream(join(__dirname, 'logs/app.log'));
 * logger.stream('theme', { theme: 'json' });
 * logger.pipe(fd);
 *
 * // enhanced usage
 * logger.pipe('file', join(__dirname, 'logs/app.log'), { theme: 'json' });
 * ```
 *
 * @param {String|Stream} name to create or existing stream
 * @param {Mixed} options
 * @param ...
 * @return {Stream}
 * @api public
 */

Logger.prototype.pipe = function(name) {
  if ('string' === typeof name) {
    var stream = Logger.stream.apply(Logger, arguments);
    return this.pipe(stream);
  } else {
    return Roundabout.prototype.pipe.apply(this, arguments);
  }
};

/**
 * ### .child(name)
 *
 * Clone current logger's settings to a new logger
 * instance. Frames logged to child logger will be
 * piped to parrent.
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

/**
 * ### .frame(level, msg, meta)
 *
 * Creates a new frame that can be written to this stream.
 * Used internally or for testing.
 *
 * @param {String} level name
 * @param {String|Object} message or object to serialize
 * @param {Object} additional meta data
 * @return {Frome}
 * @api public
 */

Logger.prototype.frame = function(level, msg, meta) {
  if (!this.level(level)) {
    var err = new Error('Invalid log level of "' + level + '".');
    this.emit('error', err);
    return null;
  }

  var frame = new Frame(this.get('name'), this.level(level));
  frame.message(msg);
  frame.meta(meta);
  return frame;
};

/**
 * # log(level, message, [data])
 *
 * General purpose logging function that accepts the
 * log level, message, and optional data JSON object.
 * Can also log object to be serialize.
 *
 * ```js
 * // with message
 * logger.log('info', 'Hello Universe');
 *
 * // with serialize
 * logger.serialize('http-request');
 * logger.log('info', req);
 * ```
 *
 * @param {String} level
 * @param {String|Object} message or object to serialize
 * @param {Object} meta (optional)
 * @return this
 * @api public
 */

Logger.prototype.log = function(lvl, msg, meta) {
  var frame = this.frame(lvl, msg, meta);
  if (!frame) return this;
  this.write(frame);
  return this;
};

/**
 * ### Log Levels
 *
 * The default log levels have shortcut methods that
 * route `.log('level', msg)`.
 *
 * - `.trace`
 * - `.debug`
 * - `.info`
 * - `.warn`
 * - `.error`
 * - `.fatal`
 *
 * @param {String|Object} message or object to serialize
 * @param {Object} meta (optional)
 * @return this
 * @api public
 */

Object.keys(Logger.levels).forEach(function(id) {
  var level = Logger.levels[id][0];
  Logger.prototype[level] = function(msg, meta) {
    return this.log(level, msg, meta);
  };
});
