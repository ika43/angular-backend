var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  surname: String,
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  confNumber: Number,
  city: {
    type: String,
    required: [true, 'City is required']
  },
  password: String,
  email: {
    type: String,
    index: true
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  active: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);