var orchid = require('orchid')
  , Client = require('./service');

module.exports = Service;

function Service (logger) {
  this.logger = logger;
  this.server = new orchid.Server();
  this.client = null;
};

Service.prototype.listen = function (port, options, cb) {
  var self = this;

  if ('function' === typeof options) {
    cb = options;
    options = {};
  }

  this.server.listen(port, function () {
    self.client = new Client('ws://localhost:' + port, options);
    self.client.on('log', writeLog.bind(self));
    self.client.on('open', cb);
  });
};

function writeLog (obj) {
  this.logger.logEvent(obj);
}
