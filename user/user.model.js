const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
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
  creditCard: {
    _id: false,
    number: Number,
    expired: Number,
    securityCode: Number
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  active: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);