const Visit = require('../visit/visit.model');
const Apartment = require('./apartment.model');

exports.userCanLeaveReview = async (visitor, apartment) => {
  return await Visit.find(
    {
      visitor,
      apartment,
      to: { $lte: new Date() }
    }
  ).countDocuments() > 0;
}

exports.leaveReview = async (_id, text, rate, user) => {
  return await Apartment.findOneAndUpdate(
    { _id },
    {
      $push: {
        review: {
          text,
          rate,
          user
        }
      }
    },
    {
      runValidators: true
    }
  )
}