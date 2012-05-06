/*!
 * Quantum - cli observe service
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Help descriptor
 */

cli.register({
    name: 'watch service'
  , description: 'Observe all log events on a quantum collection service'
  , options: {
        '-p, --port [8080]': 'The port the collector is running on.'
      , '-h, --host [localhost]': 'The host the service is running on.'
      , '-t, --theme [default]': 'Console theme to display log events on. Use `none` to disable.'
      , '-f, --file': 'Save incoming log events to this file in JSON format.'
    }
});

/**
 * # startListening
 *
 * @param {Object} optimist parsed cmd args
 */

cli.on('watch service', function startListening (args) {
  // lazy load module deps
  var Quantum= require('../../quantum')
    , orchid = require('orchid')
    , _ = require('../utils');

  // parse args
  var port = args.p || args.port || 8080
    , host = args.h || args.host || 'localhost'
    , theme = args.t || args.theme || 'default'
    , file = args.f || args.file || null;

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
});
