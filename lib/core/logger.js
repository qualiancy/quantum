var Drip = require('drip')
  , Oath = require('oath');

module.exports = Logger;

function Logger (opts) {
  Drip.call(this, { delimeter: '.' });
  var self = this;

  opts = opts || {};

  this.queue = [];
  this.initialized = false;

  this.namespace = opts.namespace || 'logger';
  this.levels = this.loadLevels(opts.levels || 'syslog');

  var transports = opts.transports || [ 'console' ];

  for (var level in this.levels.levels) {
    this.bindLevels(level);
  }

  this.loadTransports(transports).then(function () {
    self.initialized = true;
    while (self.queue.length) {
      var q = self.queue.splice(0, 1);
      self.log(q.level, q.message, q.data);
    }
  });
}

Logger.prototype.__proto__ = Drip.prototype;

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

Logger.prototype.loadLevels = function (level) {
  return require('../levels/' + level);
};

Logger.prototype.bindLevels = function (level) {
  var self = this
    , ns = this.namespace;

  this[level] = function (msg, data) {
    self.log(level, msg, data);
  }
};

Logger.prototype.tokens = {
    get date () {
      return new Date().toUTCString();
    }
  , get gid () {
      return process.getgid();
    }
  , get uid () {
      return process.getuid()
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
    , transports = this.transports || (this.transports = []);

  var success = function (res) {
    transports.push(res)
    self.emit([ 'plugin', 'loaded' ], res);
    iterate();
  };

  var failure = function (res) {
    self.emit([ 'plugin', 'failed' ], res);
    iterate();
  };

  var iterate = function () {
    var name = specs.shift()
      , mod;
    if (!name) {
      oath.resolve();
    } else if ('string' == typeof name) {
      name = name.toLowerCase();
      if (~transports.indexOf(name)) {
        self.emit([ 'transport', 'skipped' ], name);
      } else {
        mod = require('../transports/' + name);
        mod.call(self, self).then(success, failure);
      }
    } else if ('function' == typeof name) {
      var args = [ self ].concat(name[n]);
      name.apply(self, args).then(success, failure);
    } else {
      for (var n in name) {
        if (~transports.indexOf(n)) {
          self.emit([ 'transport', 'skipped' ], n);
        } else {
          var args = [ self ].concat(name[n]);
          mod = require('../transports/' + n);
          mod.apply(self, args).then(success, failure);
        }
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

