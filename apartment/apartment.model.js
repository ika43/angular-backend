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
      require: [true, 'Street number is required'],
      min: 1,
      max: 100
    }
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price is required!'],
    min: 1,
    max: 1000
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Apartment owner is require!']
  },
  description: {
    type: String,
    match: [/^[a-zA-Z .:)! \d_-]+$/, 'Please fill a valid description!']
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