'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const { userCanLeaveReview, leaveReview } = require('./apartment.service');
const Apartment = require('./apartment.model');
const Visit = require('../visit/visit.model');
const User = require('../user/user.model');
const faker = require('faker');

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
          const apartment = await Apartment.findOne({ _id: event.pathParameters.id }).populate('owner');
          return response({ apartment });
        } else {
          const apartments = await Apartment.find().populate('owner');
          return response({ apartments });
        }
      } catch (err) {
        return response({ 'error': err.message }, 500);
      }
    case 'POST':
      // TODO: Create apartment
      try {

        // get apartment from body
        const apartment = JSON.parse(event.body);
        apartment.owner = user._id;

        // create apartment
        await Apartment.create(apartment);
        console.log("APARTMENT", apartment);
        return response({ apartment });
      } catch (err) {
        console.log("ERROR", err.message)
        return response({ error: err.message }, 400)
      }

    case 'PUT':
      console.log("path", event.resource);
      switch (event.resource) {
        case '/apartment/review/{id}':
          const _id = event.pathParameters.id;
          console.log(new Date(), "ID");
          const { text, rate } = JSON.parse(event.body);
          try {
            if (await userCanLeaveReview(user._id, _id)) {
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
        case '/apartment/review/{id}':
          try {
            const review_id = event.pathParameters['_id'];
            const apart = await Apartment.update(
              // {
              //   'review._id': review_id,
              //   'review.user': user._id
              // },
              { $pull: { review: { $elemMatch: { _id: review_id } } } }
            )
            return response({ apart })
          } catch (err) {
            return response({ err }, 500);
          }

        default:
          break;
      }

    default:
      return response({ 'error': 'Not authorized exception' }, 403);
  }
}