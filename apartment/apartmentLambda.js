'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const Apartment = require('./apartment.model');
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
      // GET all apartments with owners
      try {
        const apartments = await Apartment.find().populate('owner');
        return response({ apartments });
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
    default:
      return response({ 'error': 'Not authorized exception' }, 403);
  }
}