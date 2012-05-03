var util = require('util')
  , Drip = require('drip')
  , Oath = require('oath')
  , levels = require('./levels')
  , transports = require('./transports')
  , env = process.env.NODE_ENV || 'development';

module.exports = Logger;

function Logger (opts) {
  Drip.call(this, { delimeter: '.' });
  var self = this
    , lvlArr = [];

  opts = opts || {};

  this.namespace = opts.namespace || 'app';
  this.queue = [];
  this.initialized = false;
  this.levels = levels[opts.levels || 'syslog'];

  for (var level in this.levels.levels)
    lvlArr.push(level);

  lvlArr.forEach(function (lvl) {
    self[lvl] = function (msg, data) {
      self.log(lvl, msg, data);
    }
  });

  var transports = opts[env] || opts.transports || [ 'console' ];
  this.loadTransports(transports).then(function () {
    self.initialized = true;
    while (self.queue.length) {
      var q = self.queue.splice(0, 1)[0];
      self.log(q.level, q.message, q.data);
    }
    self.emit('ready');
  });
}

util.inherits(Logger, Drip);

Logger.prototype.log = function (lvl, msg, data) {
  if (!this.initialized) {
    this.queue.push({
        level: lvl
      , message: msg
      , data: data
    });
  } else {
    var ns = this.namespace;
    this.emit([ 'log', ns, lvl ], msg, data);
  }
};

Logger.prototype.tokens = {
    get date () {
      return new Date().getTime();
    }
  , get gid () {
      return typeof process.getgid === "function" ? process.getgid() : null;
    }
  , get uid () {
      return typeof process.getuid === "function" ? process.getuid() : null;
    }
  , get pid () {
      return process.pid;
    }
  , get rss () {
      return process.memoryUsage().rss;
    }
  , get heapTotal () {
      return process.memoryUsage().heapTotal;
    }
  , get heapUsed () {
      return process.memoryUsage().heapUsed;
    }
};

Logger.prototype.serializeTokens = function () {
  var t = this.tokens;
  return {
      date: t.date
    , gid: t.gid
    , uid: t.uid
    , pid: t.pid
    , rss: t.rss
    , heapTotal: t.heapTotal
    , heapUsed: t.heapUsed
  }
};

Logger.prototype.loadTransports = function (specs) {
  var self = this
    , oath = new Oath()
    , middleware = this.transports || (this.transports = []);

  var success = function (res) {
    middleware.push(res)
    self.emit([ 'transport', 'loaded' ], res);
    iterate();
  };

  var failure = function (res) {
    self.emit([ 'transport', 'failed' ], res);
    iterate();
  };

  var iterate = function () {
    var name = specs.shift()
      , mod;
    if (!name) {
      oath.resolve();
    } else if ('string' == typeof name) {
      name = name.toLowerCase();
      mod = transports[name];
      mod.call(self, self).then(success, failure);
    } else if ('function' == typeof name) {
      var args = [ self ].concat(name[n]);
      name.apply(self, args).then(success, failure);
    } else {
      for (var n in name) {
        var args = [ self ].concat(name[n]);
        mod = transports[n];
        mod.apply(self, args).then(success, failure);
      }
    }
  };

  if (!Array.isArray(specs)) specs = [ specs ];

  if (!specs.length) {
    oath.resolve();
    return oath.promise;
  } else {
    iterate();
  }

  return oath.promise;
};

