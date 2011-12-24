var Drip = require('drip');


module.exports = Logger;

function Logger (opts) {
  Drip.call(this, { delimiter: '.' });
  var self = this;

  this.namespace = opts.namespace || 'logger';

  if (opts.transports) {
    this.loadTransports(opts.transports);
  } else {
    this.loadTransports([
      { name: 'console'
      , levels: 'syslog' }
    ]);
  }
}

Logger.prototype.__proto__ = Drip.prototype;

Logger.prototype.log = function () {
  var msg = arguments[0]
    , ns = this.namespace
    , lvl = 'info';

  this.emit([ ns, lvl ], msg);
};

Logger.prototype.loadTransports = function (specs) {
  var self = this;
  specs.forEach(function (spec) {
    console.log(spec);
    var transport = require('../transports/' + spec.name)
      , levels = require('../levels/' + spec.levels);

    console.log(levels);
  });
};