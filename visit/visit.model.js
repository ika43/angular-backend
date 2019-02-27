const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  from: {
    type: Date,
    required: [true, 'Date from for visit is required'],
    index: true
  },
  to: {
    type: Date,
    required: [true, 'Date to for visit is required'],
    index: true
  },
  apartment: {
    type: Schema.Types.ObjectId,
    ref: 'Apartment',
    required: [true, 'Apartment is required!'],
    index: true
  },
  visitor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Visitor is required!']
  },
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