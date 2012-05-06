var Quantum = require('../..')
  , log = Quantum('service-example');

log.use(Quantum.console());
log.start();

var service = Quantum.createService(log);

service.listen(5000, function () {
  log.info('Quantum service started on port 5000');
});
