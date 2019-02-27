const Visit = require('./visit.model');

exports.checkIsBooked = async (from, to) => {
  return await Visit.find(
    {
      $or: [
        { from: { $gte: new Date(from), $lte: new Date(to) } },
        { to: { $gte: new Date(from), $lte: new Date(to) } },
        { from: { $lte: new Date(from) }, to: { $gte: new Date(to) } }
      ]
    }
  ).countDocuments() > 0;
}