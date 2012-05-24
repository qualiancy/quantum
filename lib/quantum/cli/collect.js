/*!
 * Quantum - cli collection service
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Help descriptor
 */

program
  .command('collect')
  .description('Starts a Quantum collection service.')
  .option('-l, --levels [syslog]', 'Levels to use. Recommended log nodes use the same.')
  .option('-p, --port [8080]', 'The port the collector will listen on.')
  .option('-t, --theme [default]', 'Console theme to display log events on. Use `none` to disable.')
  .option('-f, --file', 'Save incoming log events to this file in JSON format.')
  .action(startCollection);

/**
 * # startCollection
 *
 * Lazy load all deps then create a logger and service
 * using the provided options.
 *
 * @param {Object} optimist parsed cmd args
 */

function startCollection (args) {
  // lazy load module deps
  var Quantum = require('../../quantum')
    , path = require('path')
    , _ = require('../utils');

  // parse args
  var levels = (args.param('l', 'levels') || 'syslog')
    , port = (args.param('p', 'port') || 8080)
    , theme = (args.param('t', 'theme') || 'default')
    , file = (args.param('f', 'file') || null);

  // create logger
  var log = new Quantum.Logger('quantum-collect', { levels: levels })
    , service = Quantum.createService(log);

  // make sure we are emitting info eqiv for every levels
  var event = 'info';
  for (var name in log.levels.levels) {
    if (log.levels.levels[name] === 1) event = name;
  }

  // if we don't want any cli output
  if (theme !== 'none') {
    log.use(Quantum.console({ theme: theme }));
    log.write(event, 'Welcome to Quantum Collect');
  }

  // if we are writing to a file
  if (file) {
    if (!_.isPathAbsolute(file))
      file = path.resolve(args.cwd, file);
    var filename = path.basename(file);
    file = path.dirname(file);
    log.use(Quantum.file(file, { theme: 'json', filename: filename }));
  }

  // initialize the log
  log.start();

  // start the collector service
  service.listen(port, function (err) {
    if (err) throw err;
    if (theme !== 'none')
      log.write(event, 'Service started on port ' + port);
  });
}
