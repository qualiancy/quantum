var Drip = require('drip')
  , Oath = require('oath');

module.exports = Logger;

function Logger (opts) {
  Drip.call(this, { delimeter: '.' });
  var self = this;

  opts = opts || {};

  this.namespace = opts.namespace || 'logger';
  this.levels = this.loadLevels(opts.levels || 'syslog');

  var transports = opts.transports || [ 'console' ];
  this.loadTransports(transports).then(function () {
    for (var level in self.levels.levels) {
      self.bindLevels(level);
    }
  });
}

Logger.prototype.__proto__ = Drip.prototype;

Logger.prototype.log = function () {
  var msg = arguments[0]
    , ns = this.namespace
    , lvl = 'info';
  this.emit([ ns, lvl ], msg);
};

Logger.prototype.loadLevels = function (level) {
  return require('../levels/' + level);
};

Logger.prototype.bindLevels = function (level) {
  var self = this
    , ns = this.namespace;

  this[level] = function (msg) {
    self.emit([ ns, level ], msg);
  }
};


Logger.prototype.loadTransports = function (specs) {
  var self = this
    , oath = new Oath()
    , middleware = this._middleware || (this._middlware = []);

  var success = function (res) {
    middleware.push(res.name)
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
      if (~middleware.indexOf(name)) {
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
        if (~middleware.indexOf(n)) {
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

