const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  address: {
    country: {
      type: String,
      match: [/^[a-zA-Z ]+$/, 'Please fill a valid country!']
    },
    state: {
      type: String,
      match: [/^[a-zA-Z ]+$/, 'Please fill a valid state!']
    },
    streetName: {
      type: String,
      match: [/^[a-zA-Z ]+$/, 'Please fill a valid street name!']
    },
    streetNumber: {
      type: Number,
      match: [/^[0-9]{1,10}$/, 'Please fill a valid street number!']
    }
  },
  personNumber: {
    type: Number,
    match: [/^[0-9]{1,10}$/, 'Please fill a valid street number!']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Apartment owner is require!']
  },
  description: {
    type: String,
    match: [/^[a-zA-Z .:) \d_-]+$/, 'Please fill a valid street name!']
  },
  review: [{
    text: {
      type: String,
      match: [/^[a-zA-Z .:) \d_-]+$/, 'Please fill a review!']
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: 1,
      max: 10
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for rate!']
    }
  }],
  visitors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Apartment', apartmentSchema);