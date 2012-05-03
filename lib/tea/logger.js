var util = require('util')
  , Drip = require('drip')
  , Oath = require('oath')
  , levels = require('./levels')
  , env = process.env.NODE_ENV || 'development';

module.exports = Logger;

function Logger (namespace, opts) {
  Drip.call(this, { delimeter: '.' });
  var self = this;

  if ('string' !== typeof namespace) {
    namespace = 'tea';
    opts = {};
  }

  opts = opts || {};

  this.namespace = namespace;
  this.logQueue = [];
  this.initQueue = [];
  this.initialized = false;

  this.levels = levels[opts.levels || 'syslog'];

  Object.keys(this.levels.levels).forEach(function (name) {
    self[name] = function (msg, data) {
      self.log(name, msg, data);
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
        , uid: typeof process.getuid === "function" ? process.getuid() : null
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
};

Logger.prototype.use = function (fn) {
  if ('function' === typeof fn)
    this.initQueue.push(fn);
  return this;
};

Logger.prototype.init = function () {
  var self = this;

  function iterate (i) {
    var fn = self.initQueue[i];
    if (!fn) {
      self.initialized = true;
      while (self.logQueue.length) {
        var q = self.logQueue.splice(0, 1)[0];
        self.log(q.level, q.message, q.data);
      }
      self.emit('ready');
    } else {
      fn(self).then(
          function () { iterate(++i); }
        , function (ex) { throw ex }
      );
    }
  }

  iterate(0);
};

Logger.prototype.log = function (lvl, msg, data) {
  var ns = this.namespace
    , tokens = this.tokens;

  if (!this.initialized) {
    this.logQueue.push({
        level: lvl
      , namespace: ns
      , message: msg
      , data: data
      , tokens: tokens
    });
  } else {
    this.emit([ 'log', ns, lvl ], msg, data, tokens);
  }
};

Logger.prototype.logEvent = function (spec) {
  var lvl = spec.levelStr
    , ns = spec.namespace
    , data = spec.data || {}
    , msg = spec.message
    , tokens = spec.tokens;

  if (!this.initialized) {
    this.logQueue.push({
        level: lvl
      , namespace: ns
      , message: msg
      , data: data
      , tokens: tokens
    });
  } else {
    this.emit([ 'log', ns, lvl ], msg, data, tokens);
  }
};
