'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const { userCanLeaveReview, leaveReview } = require('./apartment.service');
const Apartment = require('./apartment.model');
const Visit = require('../visit/visit.model');
const User = require('../user/user.model');

exports.apartment = async (event, context) => {

  let user;
  // ! validate request with jwt service
  try {
    user = decode(event.headers.Authorization);
    dbConnection();
  } catch (err) {
    return response({ error: err }, 400)
  }

  // * Create lambda router
  switch (event.httpMethod.toUpperCase()) {
    case 'GET':

      try {
        if (event.pathParameters) {

          // ! GET SINGLE APARTMENT
          const apartment = await Apartment.findOne({ _id: event.pathParameters.id }).populate('owner');
          return response({ apartment });
        } else {

          // ! GET ALL APARTMENTS
          const apartments = await Apartment.find().populate('owner');
          return response({ apartments });
        }
      } catch (err) {
        return response({ 'error': err.message }, 500);
      }
    case 'POST':
      try {

        // * get data from request
        const apartment = JSON.parse(event.body);
        apartment.owner = user._id;

        // ! CREATE APARTMENT
        await Apartment.create(apartment);
        return response({ apartment });
      } catch (err) {
        return response({ error: err.message }, 400)
      }

    case 'PUT':
      // ! CREATE A REVIEW 
      switch (event.resource) {
        case '/apartment/review/{id}':

          // * get data from request
          const _id = event.pathParameters.id;
          const { text, rate } = JSON.parse(event.body);

          try {

            // * check if user was in this apartment
            if (await userCanLeaveReview(user._id, _id)) {

              // * leave a review
              const review = await leaveReview(_id, text, rate, user._id)
              return response({ review });
            } else {
              return response({ 'error': 'User not allowed to leave review' }, 400);
            }
          } catch (err) {
            return response({ error: err.message }, 400)
          }

        default:
          break;
      }

    case 'DELETE':
      switch (event.resource) {

        // ! DELETE REVIEW
        case '/apartment/review/{id}':
          try {
            const review_id = event.pathParameters['id'];
            const apart = await Apartment.update(
              {
                'review._id': review_id,
                'review.user': user._id
              },
              { $pull: { review: { _id: review_id } } }
            )
            return response({ apart })
          } catch (err) {
            return response({ err }, 500);
          }

          // ! DELETE APARTMENT
        case '/apartment/{id}':
          try {
            await Apartment.remove({ _id: event.pathParameters['id'] });
            return response({ 'status': 'success' });
          } catch (err) {
            return response({ error: err.message }, 500);
          }
        default:
          return response({ 'error': 'Not authorized exception' }, 403);
      }

    default:
      return response({ 'error': 'Not authorized exception' }, 403);
  }
}