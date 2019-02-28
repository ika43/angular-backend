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

exports.updateApartment = async (_id, address, description, pricePerNight) => {
  return await Apartment.findOneAndUpdate(
    { _id },
    { $set: { address, description, pricePerNight } },
    { new: true, runValidators: true }
  )
}

exports.leaveReview = async (_id, text, rate, user) => {
  return await Apartment.findOneAndUpdate(
    { _id },
    { $push: { review: { text, rate, user } } },
    { new: true, runValidators: true }
  )
}