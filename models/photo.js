const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  path:  { type: String },
  caption: { type: String }
  });

module.exports = mongoose.model('Photos', photoSchema);