var transmute = require('transmute');

var Frame = require('../frame');

module.exports = function createSerializeStream(createStream, argv) {
  return transmute({
      options: { objectMode: true, highWaterMark: 1 }
    , transform: transform
  });
};

function transform(frame, enc, cb) {
  var obj = frame instanceof Frame ? frame.toJSON() : frame;
  cb(null, obj);
}
