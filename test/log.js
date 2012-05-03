if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test';

var chai = require('chai')
  , should = chai.should();

var tea = require('..')
  , Promise = require('oath');

describe('Logger', function () {

  it('should allow for environment configuration', function () {
    var log = new tea.Logger();
    log.should.respondTo('configure');

    log.configure('test', function () {
      log.testing = true;
    });

    log.configure('development', function () {
      log.develop = true;
    });

    log.testing.should.be.true;
    should.not.exist(log.develop);
  });

  it('should allow for use', function () {
    var log = new tea.Logger();
    log.should.respondTo('use');

    var called = false;
    function middleware (logger) {
      var defer = new Promise();
      logger.should.eql(log);
      called = true;
      defer.resolve();
      return defer.promise;
    }

    log.use(middleware);
    log.init();
    called.should.be.true;
  });

  it('should provide all of the transports for export', function () {
    tea.should.have.property('console')
      .and.be.a('function');
    tea.should.have.property('file')
      .and.be.a('function');
    tea.should.have.property('broadcast')
      .and.be.a('function');
  });
});
