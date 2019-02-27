'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const { checkIsBooked } = require('./visit.service');
const Visit = require('./visit.model');

exports.visit = async (event, context) => {

  let user;
  // ! validate request with jwt service
  try {
    user = decode(event.headers.Authorization);
    dbConnection();

    switch (event.httpMethod.toUpperCase()) {
      case 'GET':
        try {
          const visits = await Visit.find();
          return response({ visits });
        } catch (err) {
          return response({ error: err.message }, 500);
        }

      case 'POST':
        // get data from body
        const { apartment, from, to } = JSON.parse(event.body);

        try {
          if (!await checkIsBooked(from, to)) { // check is already booked

            // ! CREATE NEW VISIT
            const visit = await new Visit({
              from,
              to,
              apartment,
              visitor: user._id
            }).save()
            return response({ visit })
          } else {
            return response({ 'error': 'apartment is reserved for this date!' }, 400)
          }
        } catch (err) {
          return response({ error: err.message }, 400);
        }

      case 'DELETE':

        try {
          const _id = event.pathParameters.id;
          const res = await Visit.remove({ _id });
          return response({ msg: res.n })
        } catch (err) {
          return response({ error: err.message }, 400);
        }

      default:
        return response({ 'error': 'Not authorized exception' }, 403);
    }
  } catch (err) {
    return response({ error: err }, 400)
  }
}