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
var Transform = require('stream').Transform;

/*!
 * Internal constructors
 */

var LevelSet = require('./levelset');

/*!
 * Internal modules
 */

var levels = require('./levels');
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
 * @param {String} namespace (recommended)
 * @param {Object} level set
 * @api public
 */

function Logger (ns, opts) {
  if (!(this instanceof Logger)) return new Logger(ns, opts);
  Transform.call(this, { objectMode: true, highWaterMark: 1 });

  // default options
  if ('string' !== typeof ns) opts = ns, ns = 'app';
  opts = opts || {};
  this.set('env', ENV);
  this.set('namespace', ns);

  // handle tokens
  if ('string' === typeof opts.tokens) opts.tokens = [ opts.tokens ];
  this.set('tokens', opts.tokens || [ 'process', 'memory' ]);
  this._tokens = [];

  // handle levels
  this._levelset = levelsets(opts.level);
  this._levelset.mount(this);
}

/*!
 * Inherit from Drip event emitter.
 */

inherits(Logger, Transform);

/*!
 * Facet configuration
 */

facet(Logger.prototype, '_settings');

/**
 * ### clone(namespace)
 *
 * Clone current logger's settings to a new logger
 * instance. Items logged to new logger will be
 * piped to current.
 *
 * @param {String} namespace
 * @return {Logger} piped to current
 */

Logger.prototype.clone = function(name) {
  var ls = this._levelset;
  var ns = name || this.get('namespace') + '-clone';
  var logger = new Logger(ns, ls);
  logger.pipe(this);
  return logger;
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
 * - namespace {String} current namespace of the logger
 * - date {Number} ms since epoch
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

  // default tokens
  res.namespace = this.get('namespace');
  res.timestamp = new Date().getTime();

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
 * @param {Object} data (optional)
 * @api public
 */

Logger.prototype.log = function(level, msg, data) {
  var ev = { type: level };
  var tokens = this.tokens();
  data = data || {};

  msg = utils.parseValues(msg, data);
  msg = utils.parseTokens(msg, tokens);

  ev.msg = msg;
  ev.tokens = tokens;
  ev._ = data;

  this.write(ev);
  return this;
};

// TODO: pluck malformed
Logger.prototype._transform = function(ev, enc, cb) {
  if ('object' !== typeof ev) return cb();
  this.push(ev);
  return cb();
};

function levelsets(levelset) {
  if (!levelset) return levels['syslog'];

  if ('string' === typeof levelset) {
    levelset = levels[levelset];
  }

  if (!levelset || !(levelset instanceof LevelSet)) {
    var name = 'string' === typeof opts.levels ? opts.levels : 'undefined';
    var msg = 'LevelSet "' + name + '" not available.';
    throw new ReferenceError(msg);
  }

  return levelset;
}
