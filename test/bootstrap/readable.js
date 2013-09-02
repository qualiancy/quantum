var inherits = require('util').inherits;
var Readable = require('stream').Readable;

if (!Readable) {
  Readable = require('readable-stream');
}

module.exports = ReadStream;

function ReadStream () {
  Readable.call(this, { objectMode: true, highWaterMark: 1 });
  this._queue = [];
}

inherits(ReadStream, Readable);

ReadStream.prototype._read = function () {
  var self = this;

  if (this._queue.length) {
    this.push(this._queue.shift());
  } else {
    this.once('_ready', function() {
      self.push(self._queue.shift());
    });
  }
};
