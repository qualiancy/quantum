var inherits = require('tea-inherits')
  , Writable = require('stream').Writable;
  
if (!Writable) {
  Writable = require('readable-stream').Writable;
}

module.exports = WriteStream;

function WriteStream () {
  Writable.call(this, { objectMode: true, highWaterMark: 1 });
}

inherits(WriteStream, Writable);

WriteStream.prototype._write = function (logEvent, enc, next) {
  this.emit('_write', logEvent);
  next();
};