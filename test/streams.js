describe.only('Logger', function() {
  var Logger = quantum.Logger;

  function build(name, opts) {
    name = name || 'test-log';
    return new Logger(name, opts);
  }

  describe('when constructed', function() {
    it('sets env setting', function() {
      var logger = build();
      var ENV = process.env.NODE_ENV || 'development';
      logger.get('env').should.equal(ENV);
    });

    it('sets default tokens', function() {
      var logger = build();
      var def = [ 'process', 'memory' ];
      logger.get('tokens').should.deep.equal(def);
    });

    it('mounts syslog levels');
  });

  describe('when configured', function() {
    it('invokes non-env function', function() {
      var logger = build();
      var spy = chai.spy('non-env');
      logger.configure(spy);
      spy.should.have.been.called(1);
    });

    it('invokes current env function', function() {
      var logger = build();
      var spy = chai.spy('env');
      var env = logger.get('env');
      logger.configure(env, spy);
      spy.should.have.been.called(1);
    });

    it('ignores non-current env function', function() {
      var logger = build();
      var spy = chai.spy('non-current');
      var env = logger.get('env') + '-not';
      logger.configure(env, spy);
      spy.should.have.not.been.called();
    });

    it('invokes when more than one env used', function() {
      var logger = build();
      var spy = chai.spy('more-than-one');
      var env = logger.get('env');
      logger.configure(env + '-not', env, spy);
      spy.should.have.been.called(1);
    });
  });

  describe('when written to', function() {
    describe('with #write', function() {
      it('pipes to writable streams', function(done) {
        var logger = build();
        var stream = new MockWritable();
        var testEvent = { type: 'debug', msg: 'Test message' };

        logger.pipe(stream);

        stream.on('_write', function(ev) {
          ev.should.deep.equal(testEvent);
          done();
        });

        logger.write(testEvent);
      });
    });

    describe('with mounted level', function() {
      it('pipes to writable streams', function(done) {
        var logger = build();
        var stream = new MockWritable();

        logger.pipe(stream);

        stream.on('_write', function(ev) {
          ev.should.have.property('type', 'info');
          ev.should.have.property('msg', 'Test message');
          done();
        });

        logger.log('info', 'Test message');
      });
    });
  });

  describe('when read from', function() {
    describe('via readable stream', function() {
      it('emits readable event', function(done) {
        var logger = build();
        var stream = new MockReadable();
        var testEvent = { type: 'info', msg: 'Test message' };

        stream.pipe(logger);

        logger.on('readable', function() {
          var ev = this.read();
          ev.should.eql(testEvent);
          done();
        });

        stream._queue.push(testEvent);
        stream.emit('_ready');
      });
    });
  });

  describe('when cloned', function() {
    it('sets correct name', function() {
      var logger = build('parent');
      var clone = logger.clone('clone');
      clone.get('name').should.equal('clone');
    });

    it('pipes events to parent', function(done) {
      var logger = build('parent');
      var clone = logger.clone('clone');

      logger.on('readable', function() {
        var ev = this.read();
        ev.should.have.property('name', 'clone');
        done();
      });

      clone.log('info', 'Test Message');
    });

    it('supports multiple clones', function(done) {
      var logger = build('parent');
      var clone1 = logger.clone('clone1');
      var clone2 = logger.clone('clone2');
      var c = 2;

      var readable = chai.spy('readable', function() {
        var ev = this.read();
        [ 'clone1', 'clone2' ].should.contain.members([ ev.name ]);
        --c || logger.end();
      });

      logger.on('readable', readable);
      logger.on('end', done);

      clone1.log('info', 'Test');
      clone2.log('info', 'Test');
      clone1.end();
      clone2.end();
    });
  });
});
