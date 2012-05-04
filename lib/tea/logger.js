var util = require('util')
  , Drip = require('drip')
  , Oath = require('oath')
  , levels = require('./levels')
  , env = process.env.NODE_ENV || 'development';

module.exports = Logger;

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

util.inherits(Logger, Drip);

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

Logger.prototype.configure = function (_env, fn) {
  if ('function' === typeof _env) {
    fn = _env;
    env = env;
  }

  if (env === _env)
    fn();
  return this;
};

Logger.prototype.use = function (fn) {
  if ('function' === typeof fn)
    this.initQueue.push(fn);
  return this;
};

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
        var event = self.logQueue.splice(0, 1)[0]
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

Logger.prototype.log = function () {
  var event = frameEvent.apply(this, arguments);
  emitEvent.call(this, event);
  return this;
};

Logger.prototype.logEvent = function (event) {
  emitEvent.call(this, event);
  return this;
};

function frameEvent (level, message, data) {
  return {
      lvl: level
    , lvlInt: this.levels.levels[level]
    , msg: message
    , data: data
    , tokens: this.tokens
  };
}

function emitEvent (spec, force) {
  if (this.initialized || force) {
    var lvl = spec.lvl
      , ns = spec.tokens.namespace
      , msg = spec.msg;
    this.emit([ 'log', ns, lvl ], spec);
  } else {
    this.logQueue.push(spec);
  }
}
