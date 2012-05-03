var tea = require('../..')
  , log = new tea.Logger();

log.use(tea.console());
log.init();

tea.startService(5000, function (server, service) {
  service.on('log', function (obj) {
    log.logEvent(obj);
  });
});
