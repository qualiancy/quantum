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
 * Constants
 */

var ENV = process.env.NODE_ENV || 'development';

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

  // default options
  if ('string' !== typeof name) opts = name, name = 'app';
  opts = opts || {};
  this.set('env', ENV);
  this.set('name', name);

  // handle tokens
  if ('string' === typeof opts.tokens) opts.tokens = [ opts.tokens ];
  this.set('tokens', opts.tokens || [ 'process', 'memory' ]);
  this._tokens = [];

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
  ns = name || this.get('name') + '-clone';
  var clone = new Logger(name, { levels: this._levelset });
  clone.pipe(this, { end: false });
  return clone;
};

/**
 * token(name, value)
 *
 * Define tokens for a loggers token set. Value can be
 * a static value or a function that returns the value.
 * `undefined` values will be not be included.
 *
 * @param {String} name
 * @param {Mixed} value
 * @api public
 */

Logger.prototype.token = function(name, value) {
  this._tokens.push({ name: name, value: value });
  return this;
};

/**
 * # tokens()
 *
 * Provides a JSON object representing current state of
 * the logger and process. Will be be different for each
 * call.
 *
 * Tokens
 * - guid {Number} process guid
 * - uid {Number} process uid
 * - pid {Number} process pid
 * - rss {Number} process memory usage rss
 * - heapTotal {Number} process memory usage heap total
 * - heapUsed {Number} process memory usage heap used
 *
 * @api public
 * @see http://nodejs.org/api/process.html
 */

Logger.prototype.tokens = function() {
  var res = {}
  var tokens = this.get('tokens');

  // process tokens
  if (~tokens.indexOf('process')) {
    res.pid = process.pid;
    res.gid = ('function' === typeof process.getgid) ? process.getgid() : null;
    res.uid = ('function' === typeof process.getuid) ? process.getuid() : null;
  }

  // memory tokens
  if (~tokens.indexOf('memory')) {
    var mem = process.memoryUsage();
    res.rss = mem.rss;
    res.heapTotal = mem.heapTotal;
    res.heapUsed =  mem.heapUsed;
  }

  // custom tokens
  this._tokens.forEach(function(token) {
    var value = token.value;
    if ('function' === typeof value) value = value();
    if (undefined !== value) res[token.name] = value;
  });

  return res;
};

/**
 * @param {String} NODE_ENV switch (optional)
 * @param {Function} callback to run on environment match
 * @api public
 */

Logger.prototype.configure = function () {
  var args = [].slice.call(arguments);
  var env = this.get('env');
  var fn = args.pop();

  if (!args.length || ~args.indexOf(env)) {
    fn.call(this);
  }

  return this;
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
