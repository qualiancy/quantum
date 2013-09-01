describe.only('Logger', function () {
  it('should write to writable streams', function (done) {
    var logger = new quantum.Logger('test-namespace');
    var stream = new MockWritable();
    var testEvent = { type: 'debug', msg: 'Test message' };

    logger.pipe(stream);

    stream.on('_write', function (ev) {
      ev.should.deep.equal(testEvent);
      done();
    });

    logger.write(testEvent);
  });

  it('should read from readable streams', function (done) {
    var logger = new quantum.Logger('test-namespace');
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

  it('should write to a writable stream from a mounted level', function (done) {
    var logger = new quantum.Logger('test-namespace');
    var stream = new MockWritable();

    logger.pipe(stream);

    stream.on('_write', function (ev) {
      ev.should.have.property('type', 'info');
      ev.should.have.property('msg', 'Test message');
      done();
    });

    logger.log('info', 'Test message');
  });
});
