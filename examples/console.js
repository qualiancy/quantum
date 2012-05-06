var Quantum = require('..');


console.log('');

[ 'clean', 'default', 'npm' ].forEach(function (theme) {
  console.log('== THEME: %s ==', theme);
  console.log('');

  var log = Quantum('my-app');

  log.use(Quantum.console({ theme: theme }));
  log.start();

  log.write('info', 'Tea please!');
  log.info('This is info.');
  log.debug('This is debug.');
  log.notice('This is a notice.');
  log.warn('This is a warning.');
  log.error('This is an error.');
  log.crit('This is critical!!');
  log.alert('This is an alert.');
  log.emerg('This is an emergency.');

  console.log('');
  console.log('');
});
