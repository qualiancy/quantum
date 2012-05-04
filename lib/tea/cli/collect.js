/*!
 * tea - cli collection service
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Help descriptor
 */

cli.register({
    name: 'collect'
  , description: 'Starts a Tea collection service.'
  , options: {
        '-l, --levels [syslog]': 'Levels to use. Recommended log nodes use the same.'
      , '-p, --port [8080]': 'The port the collector will listen on.'
      , '-t, --theme [default]': 'Console theme to display log events on. Use `none` to disable.'
      , '-f, --file': 'Save incoming log events to this file in JSON format.'
    }
});

/**
 * # startCollection
 *
 * Lazy load all deps then create a logger and service
 * using the provided options.
 *
 * @param {Object} optimist parsed cmd args
 */

cli.on('collect', function startCollection (args) {
  // lazy load module deps
  var Tea = require('../../tea')
    , path = require('path')
    , _ = require('../utils');

  // parse args
  var levels = args.l || args.levels || 'syslog'
    , port = args.p || args.port || 8080
    , theme = args.t || args.theme || 'default'
    , file = args.f || args.file || null;

  // create logger
  var log = new Tea.Logger('tea-collect', { levels: levels })
    , service = Tea.createService(log);

  // make sure we are emitting info eqiv for every levels
  var event = 'info';
  for (var name in log.levels.levels) {
    if (log.levels.levels[name] === 1) event = name;
  }

  // if we don't want any cli output
  if (theme !== 'none') {
    log.use(Tea.console({ theme: theme }));
    log.write(event, 'Welcome to Tea Collect');
  }

  // if we are writing to a file
  if (file) {
    if (!_.isPathAbsolute(file))
      file = path.resolve(args.cwd, file);
    var filename = path.basename(file);
    file = path.dirname(file);
    log.use(Tea.file(file, { theme: 'json', filename: filename }));
  }

  // initialize the log
  log.init();

  // start the collector service
  service.listen(port, function (err) {
    if (err) throw err;
    if (them !== 'none')
      log.write(event, 'Service started on port ' + port);
  });
});
