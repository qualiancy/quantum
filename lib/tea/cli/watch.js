/*!
 * tea - cli file watcher
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Help descriptor
 */

cli.register({
    name: 'watch'
  , description: 'Starts a Tea collection service.'
  , options: {
        '-l, --levels [syslog]': 'Levels used in the file. Ignored if theme is `json`'
      , '-t, --theme [default]': 'Console theme to display log events on.'
      , '-f, --file': 'Listen for log events on this file. Expected JSON format.'
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

cli.on('watch', function startFileWatch (args) {
  // lazy load module deps
  var Tea = require('../../tea')
    , fs = require('fs')
    , path = require('path')
    , exst = fs.existsSync || path.existsSync
    , _ = require('../utils');

  // parse args
  var levels = args.l || args.levels || 'syslog'
    , theme = args.t || args.theme || 'default'
    , file = args.f || args.file || null ;

  // create logger
  var log = new Tea.Logger('tea-collect', { levels: levels });
  log.use(Tea.console({ theme: (theme === 'json') ? 'default' : theme }));
  log.init();

  if (!file)
    throw new Error('File not provided.');

  if (!_.isPathAbsolute(file))
    file = path.resolve(args.cwd, file);

  if (!exst(file))
    throw new Error('File does not exist');

  var stream = fs.createReadStream(file, {
    flags: 'a+'
  });

  stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    console.log(chunk);
  });
});
