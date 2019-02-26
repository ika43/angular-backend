const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  from: {
    type: Date,
    required: [true, 'Date from for visit is required'],
  },
  to: {
    type: Date,
    required: [true, 'Date to for visit is required'],
  },
  // visitorsNumber: {
  //   type: Number,
  //   required: [true, 'Visitors number is required!']
  // },
  apartment: {
    type: Schema.Types.ObjectId,
    ref: 'Apartment',
    required: [true, 'Apartment is required!']
  },
  visitors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Visitor is required!']
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

module.exports = mongoose.model('Visit', visitSchema);