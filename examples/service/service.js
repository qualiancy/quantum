var tea = require('../..');

var log = new tea.Logger();

tea.startService(5000, function (server, service) {

  service.on('log', function (obj) {
    log.logEvent(obj);
  });

});
