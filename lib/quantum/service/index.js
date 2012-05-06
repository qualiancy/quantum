/*!
 * Quantum - Service
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var orchid = require('orchid')
  , Client = require('./service');

/*!
 * Main export
 */

module.exports = Service;

/**
 * # Service (constructor)
 *
 * A service is a websocket service with
 * a mounted logger to proxy events to and
 * dedicated websocket client to listen
 * for incoming events.
 *
 * @param {Logger} logger to recieve events
 * @api public
 */

function Service (logger) {
  this.logger = logger;
  this.server = new orchid.Server();
  this.client = null;
};

/**
 * # listen(port, [options, cb])
 *
 * Start the listening sequence for the service
 *
 * @param {Number} port
 * @param {Object} websocket options
 * @param {Function} callback on complete
 * @api public
 */

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

/*!
 * # writeLog(event)
 *
 * Proxy a recieved log event to the current bound logger
 *
 * @param {Object} event
 * @api private
 */

function writeLog (event) {
  this.logger.logEvent(event);
}
