if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test';

var chai = require('chai')
  , should = chai.should();

var tea = require('..');

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
      logger.should.eql(log);
      called = true;
    }

    log.use(middleware);
    called.should.be.true;
  });

  it('should provide all of the transports for export', function () {
    tea.should.have.property('console')
      .and.be.a('function');
    tea.should.have.property('file')
      .and.be.a('function');
    tea.should.have.property('service')
      .and.be.a('function');
  });
});
