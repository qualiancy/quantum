var inherits = require('util').inherits;
var Writable = require('stream').Writable;

module.exports = WriteStream;

function WriteStream() {
  Writable.call(this, { objectMode: true, highWaterMark: 1 });
}

inherits(WriteStream, Writable);

WriteStream.prototype._write = function(ev, enc, next) {
  this.emit('_write', ev);
  next();
};
