const mongoose = require('mongoose');

const pubSchema = new mongoose.Schema({
  path:  { type: String },
  pic: {type: String},
  title: { type: String }
  });

module.exports = mongoose.model('Pub', pubSchema);