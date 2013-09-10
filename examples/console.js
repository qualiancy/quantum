var quantum = require('..');
var async = require('breeze-async');

var THEMES = [
    'default'
  , 'simple'
  , 'clean'
  , 'npm'
  , 'json'
];

console.log('');

async.forEachSeries(THEMES, function(name, next) {
  console.log('== THEME: %s ==', name);
  console.log('');

  var log = quantum('my-app');
  var theme = new quantum.streams.ThemeStream(name);
  log.pipe(theme).pipe(process.stdout);

  log.on('end', function() {
    console.log('');
    console.log('');
    next();
  });

  log.info('This is info.');

  log.notice('This is a notice.');
  log.warn('This is a warning.');
  log.error('This is an error.');
  log.crit('This is critical!!');
  log.alert('This is an alert.');
  log.emerg('This is an emergency.');

  log.debug('This is debug.', {
      hello: 'universe'
    , withArray: [
        'hello'
        , 'universe'
        , { quantum: true
          , fast: 4 }
      ]
    , withObj: {
        hello: 'univese'
      }
  });

  log.end();
});
