var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  id: String,
  shortUrl: String,
  longUrl: String,
  clicks: Number,
  timestamp: Number,
});

module.exports = mongoose.model('Link', linkSchema);
