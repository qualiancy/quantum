/*!
 * tea - Logger
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var util = require('util')
  , Drip = require('drip')
  , Oath = require('oath')
  , levels = require('./levels')
  , env = process.env.NODE_ENV || 'development';

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
 * @param {Object} options
 * @api public
 */

function Logger (namespace, opts) {
  // ensure a namespace
  if ('string' !== typeof namespace) {
    namespace = 'app';
    opts = {};
  }

  // setup as event emitter
  Drip.call(this, { delimeter: '.' });

  // prepare our internatls option
  opts = opts || {};
  this.initialized = false;
  this.namespace = namespace;
  this.levels = levels[opts.levels || 'syslog'];
  this.logQueue = [];
  this.initQueue = [];

  // mount functions for specific log level
  var self = this;
  Object
    .keys(this.levels.levels)
    .forEach(function (lvl) {
      self[lvl] = function (msg, data) {
        var event = frameEvent.call(self, lvl, msg, data);
        emitEvent.call(self, event);
        return self;
      };
    });
}

/*!
 * Inherit from Drip event emitter.
 */

util.inherits(Logger, Drip);

/**
 * # tokens
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

Object.defineProperty(Logger.prototype, 'tokens',
  { get: function () {
      return {
          namespace: this.namespace
        , date: new Date().getTime()
        , gid: (typeof process.getgid === "function") ? process.getgid() : null
        , uid: (typeof process.getuid === "function") ? process.getuid() : null
        , pid: process.pid
        , rss: process.memoryUsage().rss
        , heapTotal: process.memoryUsage().heapTotal
        , heapUsed: process.memoryUsage().heapUsed
      };
    }
});

/**
 * # configure([env], cb)
 *
 * Utility method for easy NODE_ENV based configuration.
 *
 *      log.configure('production', function () {
 *        // do something
 *      });
 *
 * @param {String} NODE_ENV switch (optional)
 * @param {Function} callback to run on environment match
 * @api public
 */

Logger.prototype.configure = function (_env, fn) {
  if ('function' === typeof _env)
    _env();
  else if (env === _env)
    fn();
  return this;
};

/**
 * # use(middleware)
 *
 * Queue up a middleware to mount onto the logger upon init.
 * Multiple middlewares/transports can be used per logger.
 *
 *      log.use(tea.console());
 *
 * @param {Function} middleware
 * @api public
 */

Logger.prototype.use = function (fn) {
  if ('function' === typeof fn)
    this.initQueue.push(fn);
  return this;
};

/**
 * # init([callback])
 *
 * Initialize all of the middlewares/transports for the log
 * and call (optional) callback on completion. Callback could
 * also include an error parameter passed from a middleware if
 * it fails to mount. Log will emit ready event on completion or
 * an error event if a middleware fails to load.
 *
 * Any log events queued up before the middleware has loaded will
 * be replayed with their original tokens upon successfully loading
 * all middleware but before the ready event has been emitted.
 *
 * @param {Function} callback (optional)
 * @api public
 */

Logger.prototype.init = function (cb) {
  var self = this;

  function iterate (i) {
    var fn = self.initQueue[i];
    if (fn) {
      function resolved () { iterate(++i); }
      function rejected (ex) {
        self.emit('error', err);
        if (cb && 'function' === typeof cb)
          cb(err);
      };

      fn(self)
        .then(resolved, rejected);
    } else {
      while (self.logQueue.length) {
        var event = self.logQueue.shift()
        emitEvent.call(self, event, true);
      }

      self.initialized = true;
      self.emit('ready');
      if (cb && 'function' === typeof cb)
        cb(null);
    }
  }

  if (!this.initialized)
    iterate(0);
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

Logger.prototype.log = function () {
  var event = frameEvent.apply(this, arguments);
  emitEvent.call(this, event);
  return this;
};

/**
 * # logEvent(event)
 *
 * Logs a framed log event object and commits it to
 * the current object. Useful when proxying log events
 * from one logger to another (as in recieving the log
 * events from the broadcast middleware).
 *
 * @param {Object} framed log event
 * @api public
 */

Logger.prototype.logEvent = function (event) {
  emitEvent.call(this, event);
  return this;
};

/*!
 * # frameEvent(level, message, [data])
 *
 * Frames the arguments from log or any of the log
 * levels with the tokens for that log call. Returns
 * a framed log event object.
 *
 * @param {String} level
 * @param {String} message
 * @param {Object} data (optional)
 * @api private
 */

function frameEvent (level, message, data) {
  return {
      lvl: level
    , lvlInt: this.levels.levels[level]
    , msg: message
    , data: data
    , tokens: this.tokens
  };
}

/*!
 * # emitEvent(event, [force])
 *
 * Will either emit or queue of the framed log
 * event. The force option is used internally
 * after all middlewares and intialized and the queue
 * is being replayed.
 *
 * @param {Object} framed log event
 * @param {Boolean} force overrides initialize check
 */

function emitEvent (event, force) {
  if (this.initialized || force) {
    var lvl = event.lvl
      , ns = event.tokens.namespace
      , msg = event.msg;
    this.emit([ 'log', ns, lvl ], event);
  } else {
    this.logQueue.push(spec);
  }
}
