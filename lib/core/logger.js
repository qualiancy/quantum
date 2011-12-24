var Drip = require('drip');


module.exports = Logger;

function Logger (opts) {
  Drip.call(this, { delimeter: '.' });
  var self = this;
  opts = opts || {};

  this.namespace = opts.namespace || 'logger';
  this.levels = this.loadLevels(opts.levels || 'syslog');

  var transports = opts.transports || [ 'console' ];
  this.loadTransports(transports);
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
    , ns = this.namespace;

  specs.forEach(function (spec) {
    var transport;
    if ('string' == typeof spec) {
      transport = require('../transports/' + spec);
    } else {
      transport = require('../transports/' + spec.name);
    }

    transport.call(self);

    for (var level in self.levels.levels) {
      self.bindLevels(level);
    }
  });
};

