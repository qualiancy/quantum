if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test';

var chai = require('chai')
  , spies = require('chai-spies')
  , should = chai.should();

chai.use(spies);

var quantum = require('..')
  , quantumLevels = require('../lib/quantum/levels')
  , Promise = require('oath');

describe('Logger', function () {

  it('should export correctly', function () {
    quantum.should.be.a('function');
    quantum.Logger.should.be.a('function');
  });

  it('should allow for environment configuration', function () {
    var log = new quantum.Logger();
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
    var log = new quantum.Logger();
    log.should.respondTo('use');

    var called = false;
    function middleware (logger) {
      var defer = new Promise();
      logger.should.eql(log);
      called = true;
      defer.resolve({});
      return defer.promise;
    }

    log.use(middleware);
    log.start();
    called.should.be.true;
  });

  it('should provide all of the transports for export', function () {
    quantum.should.have.property('console')
      .and.be.a('function');
    quantum.should.have.property('writeFile')
      .and.be.a('function');
  });

  describe('levels', function () {
    function checkLevels (log, done) {
      return function checkLevel (level) {
        log._levels.levels
          .should.have.property(level)
          .be.a('number');

        var spy = chai.spy(function (event) {
          should.exist(event);
          event.should.be.a('object');
          event.should.have.property('level', level);
        });

        log.once('event', spy);
        log.once([ 'event', level ], spy);

        log.write(level, 'hello universe');
        spy.should.have.been.called.twice;
        done();
      }
    }

    it('should automatically mount the `syslog` levels', function () {
      var log = quantum('check-syslog')
        , levels = Object.keys(quantumLevels.syslog.levels)
        , spy = chai.spy();

      log.start();
      levels.forEach(checkLevels(log, spy));
      spy.should.have.been.called.exactly(levels.length);
    });

    it('should allow for levels to be mounted', function () {
      var log = quantum('check-levels')
        , levels = Object.keys(quantumLevels.syslog.levels)
        , spy = chai.spy();

      log.levels('syslog');
      log.start();
      levels.forEach(checkLevels(log, spy));
      spy.should.have.been.called.exactly(levels.length);
    });

    it('should work for `cli` levels', function () {
      var log = quantum('check-levels')
        , levels = Object.keys(quantumLevels.cli.levels)
        , spy = chai.spy();

      log.levels('cli');
      log.start();
      levels.forEach(checkLevels(log, spy));
      spy.should.have.been.called.exactly(levels.length);
    });

    it('should work for `http` levels', function () {
      var log = quantum('check-levels')
        , levels = Object.keys(quantumLevels.http.levels)
        , spy = chai.spy();

      log.levels('http');
      log.start();
      levels.forEach(checkLevels(log, spy));
      spy.should.have.been.called.exactly(levels.length);
    });

    it('should allow for custom levels', function () {
      var log = quantum('check-levels')
        , lvlSpec = { levels: { one: 1, two: 2 } }
        , levels = Object.keys(lvlSpec.levels)
        , spy = chai.spy();

      log.levels(lvlSpec);
      log.start();
      levels.forEach(checkLevels(log, spy));
      spy.should.have.been.called.exactly(levels.length);
    });
  });

  describe('tokens', function () {
    it('should allow for custom tokens', function (done) {
      var log = quantum('check-tokens');

      log.start();
      log.token('env', 'testing');

      log.on('event', function(ev) {
        ev.tokens.should.have.property('env', 'testing');
        done();
      });

      log.write('info', 'testing token');
    });
  });

  describe('message parsing', function () {

    it('can parse tokens', function () {
      var log = quantum('parsing').start()
        , spy = chai.spy(function (event) {
            event.msg.should.equal('hello parsing universe');
          });

      log.on('event', spy);
      log.info('hello ::namespace universe');
      spy.should.have.been.called.once;
    });

    it('can parse tokens', function () {
      var log = quantum('parsing').start()
        , spy = chai.spy(function (event) {
            event.msg.should.equal('hello universe');
          });

      log.on('event', spy);
      log.info('hello #{where}', { where: 'universe' });
      spy.should.have.been.called.once;
    });

    it('can parse colorize', function () {
      var log = quantum('parsing').start()
        , spy = chai.spy(function (event) {
            event.msg.should.equal('hello \u001b[31muniverse\u001b[0m');
          });

      log.on('event', spy);
      log.info('hello [universe](red)', { where: 'universe' });
      spy.should.have.been.called.once;
    });

    it('can parse complex messages', function () {
      var log = quantum('parsing').start()
        , spy = chai.spy(function (event) {
            event.msg.should.equal('hello \u001b[31muniverse\u001b[0m from \u001b[34mparsing\u001b[0m');
          });

      log.on('event', spy);
      log.info('hello [#{where}](red) from [::namespace](blue)', { where: 'universe' });
      spy.should.have.been.called.once;
    });

  });

  describe('emitter transport', function () {

    it('can accept emitted events', function () {
      var log = quantum('log')
        , emitter = quantum.emitter()
        , spy = chai.spy(function (event) {
            event.should.have.property('level', 'info');
            event.should.have.property('msg', 'testing')
            event.should.have.property('_')
              .deep.equal({ testing: true });
            event.should.have.property('tokens')
              .with.keys('namespace', 'timestamp');
          });

      emitter.on('event', spy);

      log.use(emitter);
      log.start();
      log.write('info', 'testing', { testing: true });
      spy.should.have.been.called.once;
    });

  });

  describe('cloning', function () {

    it('should allow for a log to be cloned', function () {
      var log1 = quantum('log-1')
        , spy1 = chai.spy(function (event) {
            event.should.have.property('level', 'info');
            event.should.have.property('msg', 'testing')
            event.should.have.property('_')
              .deep.equal({ testing: true });
            event.should.have.property('tokens')
              .with.keys('namespace', 'timestamp');
            event.tokens.namespace.should.equal('log-2');
          });

      log1.start();
      log1.on('event', spy1);

      var log2 = log1.clone('log-2')
        , spy2 = chai.spy();
      log2._opts.namespace.should.equal('log-2');
      log2.start();

      log2.on('event', spy2);
      log2.write('info', 'testing', { testing: true });

      spy1.should.have.been.called.once;
      spy2.should.have.been.called.once;
    });

  });
});
