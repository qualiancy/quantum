describe.only('Logger', function () {
  it('should write to writable streams', function (done) {
    var logger = new quantum.Logger('test-namespace')
      , stream = new MockWritable()
      , testEvent = { level: 'debug', msg: 'Test message' };

    logger.writable(stream);
    
    stream.on('_write', function (logEvent) {
      logEvent.should.eql(testEvent);
      done();
    });
    
    logger.logEvent(testEvent);
  });
  
  it('should read from readable streams', function (done) {
    var logger = new quantum.Logger('test-namespace')
      , stream = new MockReadable()
      , testEvent = { level: 'info', msg: 'Test message' };
      
    logger.readable(stream);
    
    logger.on('event', function (logEvent) {
      logEvent.should.eql(testEvent);
      done();
    });
    
    stream._queue.push(testEvent);
    stream.emit('_ready');
  });
  
  it('should write to a writable stream from a mounted level', function (done) {
    var logger = new quantum.Logger('test-namespace')
      , stream = new MockWritable()
    
    logger.writable(stream);
    
    stream.on('_write', function (logEvent) {
      logEvent.should.have.property('level', 'info');
      logEvent.should.have.property('msg', 'Test message');
      done();
    });
    
    logger.info('Test message');
  });
});