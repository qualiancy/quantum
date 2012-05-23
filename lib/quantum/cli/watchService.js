/*!
 * Quantum - cli observe service
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Help descriptor
 */

program
  .action('watch service')
  .description('Observe all log events on a quantum collection service')
  .action('-p, --port [8080]', 'The port the collector is running on.')
  .action('-h, --host [localhost]', 'The host the service is running on.')
  .action('-t, --theme [default]', 'Console theme to display log events on. Use `none` to disable.')
  .action('-f, --file', 'Save incoming log events to this file in JSON format.')
  .action(startListening);

/**
 * # startListening
 *
 * @param {Object} optimist parsed cmd args
 */

function startListening (args) {
  // lazy load module deps
  var Quantum= require('../../quantum')
    , orchid = require('orchid')
    , _ = require('../utils');

  // parse args
  var host = args.param('h', 'host') || 'localhost'
    , port = args.param('p', 'port') || 8080
    , theme = args.param('t', 'theme') || 'default'
    , file = args.param('f', 'file') || null;

  var log = new Quantum.Logger('quantum-watch');
  log.use(Quantum.console({ theme: theme }));
  log.start();

  var observer = new orchid.Client('ws://' + host + ':' + port);

  observer.on('open', function () {
    log.write('info', 'Successfully connected to Quantum collection service at ' + host + ':' + port);
  });

  observer.on([ 'quantum', 'log' ], function (event) {
    log.logEvent(event);
  });
}
