describe('Logger', function() {

  function build(name, opts) {
    name = name || 'test-log';
    return quantum(name, opts);
  }

  describe('when constructed', function() {

  });

  describe('when written to', function() {
    describe('with #write', function() {
      it('pipes to writable streams', function(done) {
        var logger = build();
        var stream = new MockWritable();
        var testEvent = logger.frame('info', 'Test Message');

        logger.pipe(stream);

        stream.on('_write', function(ev) {
          ev.should.deep.equal(testEvent);
          done();
        });

        logger.write(testEvent);
      });
    });

    describe('with mounted level', function() {
      it('responds to all levels', function() {
        var logger = build();

        Object.keys(quantum.levels).forEach(function(lvl) {
          var level = quantum.levels[lvl];
          logger.should.itself.respondTo(level[0]);
        });
      });

      it('pipes to writable streams', function(done) {
        var logger = build();
        var stream = new MockWritable();

        logger.pipe(stream);

        stream.on('_write', function(ev) {
          ev.should.have.deep.property('settings.level', logger.level('info'));
          ev.should.have.deep.property('settings.message', 'Test message');
          done();
        });

        logger.info('Test message');
      });
    });
  });

  describe('when read from', function() {
    describe('via readable stream', function() {
      it('emits readable event', function(done) {
        var logger = build();
        var stream = new MockReadable();
        var testEvent = logger.frame('info', 'Test Message');

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

  describe('when child created', function() {
    it('sets correct name', function() {
      var logger = build('parent');
      var child = logger.child('child');
      child.get('name').should.equal('child');
    });

    it('pipes events to parent', function(done) {
      var logger = build('parent');
      var child = logger.child('child');

      logger.on('readable', function() {
        var ev = this.read();
        ev.should.have.deep.property('settings.name', 'child');
        done();
      });

      child.log('info', 'Test Message');
    });

    it('supports multiple childs', function(done) {
      var logger = build('parent');
      var child1 = logger.child('child1');
      var child2 = logger.child('child2');
      var c = 2;

      var readable = chai.spy('readable', function() {
        var ev = this.read();
        if (!ev) return;
        [ 'child1', 'child2' ].should.contain.members([ ev.settings.name ]);
        --c || logger.end();
      });

      logger.on('readable', readable);
      logger.on('end', done);

      child1.log('info', 'Test');
      child2.log('info', 'Test');
      child1.end();
      child2.end();
    });
  });
});
