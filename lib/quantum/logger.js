/*!
 * Quantum - Logger
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var util = require('util')
  , Drip = require('drip')
  , Oath = require('oath')
  , Filter = require('filtr')

var _ = require('./utils')
  , emitProxy = require('./transports/emitter')
  , quantumLevels = require('./levels')
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
  this.initialized = false;

  // prepare our internatls options
  opts = opts || {};
  this._opts = {
      namespace: namespace
    , levels: opts.levels || 'syslog'
    , tokens: opts.tokens || 'basic'
  };

  // queues to support various features
  this._queue = {
      init: []
    , log: []
    , token: []
    , filter: []
    , read: []
    , write: []
  };
}

/*!
 * Inherit from Drip event emitter.
 */

util.inherits(Logger, Drip);

/**
 * # clone(namespace)
 *
 *
 */

Logger.prototype.clone = function (ns) {
  ns = ns || this._opts.namespace;

  var logger = new Logger(ns, {
      levels: this._opts.levels
    , tokens: this._opts.tokens
  });

  var emitter = emitProxy()
  emitter.on('event', this.logEvent.bind(this));
  logger.use(emitter);

  return logger;
};

/**
 * # levels(spec)
 *
 * Change the levels definition for use with the
 * current constructed version of the logger. Will
 * not do anything if the logger has already been
 * started and levels are not mounted until `.start()`
 * has been called.
 *
 * @param {String|Object} level specifications
 * @api public
 */

Logger.prototype.levels = function (spec) {
  if (!this.initialized) this._opts.levels = spec;
  return this;
};

/**
 * # token(name, value)
 *
 * Dynamically add token definitions to a loggers
 * token set. Return undefined to skip for a specific
 * scenario. Value can be a static value or a function
 * to dynamicly build the value. `undefined` values will
 * be skipped.
 *
 * @param {String} token name
 * @param {Mixed}
 * @api public
 */

Logger.prototype.token = function (token, val) {
  var spec = {
      name: token
    , val: val
  };

  this._queue.token.push(spec);
  return this;
};

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
      var res = {}
        , timestamp = new Date().getTime();

      this._queue.token.forEach(function (spec) {
        var val = ('function' === typeof spec.val)
          ? spec.val()
          : spec.val;
        if (val) res[spec.name] = val;
      });

      res.namespace = this._opts.namespace;
      res.timestamp = timestamp;

      if (~[ 'process', 'memory' ].indexOf(this._opts.tokens)) {
        res.pid = process.pid;
        res.gid = ('function' === typeof process.getgid)
          ? process.getgid()
          : null;
        res.uid = ('function' === typeof process.getuid)
          ? process.getuid()
          : null;
      }

      if (this._opts.tokens == 'memory') {
        res.rss = process.memoryUsage().rss;
        res.heapTotal = process.memoryUsage().heapTotal;
        res.heapUsed =  process.memoryUsage().heapUsed;
      }

      return res;
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
 *      log.use(quantum.console());
 *
 * @param {Function} middleware
 * @api public
 */

Logger.prototype.use = function (fn) {
  if ('function' === typeof fn.handle) {
    this._queue.init.push(fn.handle);
  } else {
    this._queue.init.push(fn);
  }

  return this;
};

/**
 * # start([callback])
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

Logger.prototype.start = function (cb) {
  var self = this;
  cb = cb || function () {};

  // when we have mounted all transports...
  function initialize () {
    while (self._queue.log.length) {
      var event = self._queue.log.shift()
      emitEvent.call(self, event, true);
    }

    self.initialized = true;
    self.emit('ready');
    cb(null);
  }

  // each iteration may: resolve and parse transport specs
  function resolved (i) {
    return function parseSpec (spec) {
      if (spec.type == 'write') {
        self._queue.write.push(spec);
      } else if (spec.type == 'read') {
        self._queue.read.push(spec);
      }

      iterate(i);
    }
  }

  // each iteration may: reject and send back error
  function rejected (ex) {
    self.emit('error', err);
    if (cb && 'function' === typeof cb)
      cb(err);
  }

  function iterate (i) {
    var fn = self._queue.init[i];
    if (!fn) return initialize();
    fn(self).then(resolved(++i), rejected);
  }

  if (!this.initialized) {
    mountLevels.call(this);
    iterate(0);
  }

  return this;
};

/**
 * # write(level, message, [data])
 *
 * General purpose logging function that accepts the
 * log level, message, and optional data JSON object.
 *
 * @param {String} level
 * @param {String} message
 * @param {Object} data (optional)
 * @api public
 */

Logger.prototype.write = function () {
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

/**
 * # filter(condition)
 *
 * Filters are evaluated before a log event is emitted. If
 * the condition returns true, the event is logged. A condition
 * can be either a function or a query object.
 *
 *     log.filter(function (event) {
 *       if (event._.user_id == 10) return true;
 *     });
 *
 *     log.filter({ '_.user_id': { $eq: 10 }});
 *
 * Consult the README for appropriately formatted queries.
 *
 * Though you can filter on levels, it is recommended to use
 * a transports `levels` configuration option for a minutae of
 * improved performance.
 *
 * @param {Function|Object} condition
 * @api true
 */

Logger.prototype.filter = function (condition) {
  if (condition) this._queue.filter.push(condition);
  return this;
};

/*!
 * # mountLevels()
 *
 * Mounts the levels definition to the current constructed
 * logger. If a string is provided will use one of the provides
 * templates. If an object is provided, will mount directly.
 *
 * @api private
 */


function mountLevels () {
  var self = this
    , useLevels = this._opts.levels
    , levels = ('string' === typeof useLevels)
      ? quantumLevels[useLevels]
      : useLevels;

  this._levels = levels;

  Object
    .keys(levels.levels)
    .forEach(function (lvl) {
      self[lvl] = function (msg, data) {
        var event = frameEvent.call(self, lvl, msg, data);
        emitEvent.call(self, event);
        return self;
      };
    });
}

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
      level: level
    , msg: message
    , _: data
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
  if (!this.initialized && !force) {
    return this._queue.log.push(event);
  }

  if (evaluateConditions.call(this, event)) {
    event = _.parseMessage(event);
    this.emit('event', event);
    this.emit([ 'event', event.level ], event);
    this._queue.write.forEach(function (spec) {
      spec.write(event);
    });
  }
}

/*!
 * # evaluateConditions(event)
 *
 * Will eveluate the current event against all conditions
 * declared by `Logger#filter`. Will return a boolean
 * indicating whether the event is suitable to emit.
 *
 * @param {Object} log event
 * @returns {Boolean} valid
 * @api private
 */

function evaluateConditions (event) {
  var valid = true;

  this._queue.filter.forEach(function (condition) {
    if ('function' === typeof condition) {
      if (condition(event) === false) valid = false;
    } else if ('object' === typeof condition) {
      var Q = Filtr(condition)
        , res = Q.test(event, { single: true });
      if (!res) valid = false;
    }
  });

  return valid;
}
