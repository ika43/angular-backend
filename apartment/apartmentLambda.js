'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const Apartment = require('./apartment.model');
const faker = require('faker');

exports.apartment = async (event, context) => {

  let user;
  // ! validate request with jwt service
  try {
    user = decode(event.headers.Authorization);
  } catch (err) {
    return response({ error: err }, 400)
  }

  // TODO: Create apartment

  try {
    const apartment = await new Apartment(
      {
        address: {
          country: faker.address.country(),
          state: faker.address.state(),
          streetName: 23,//faker.address.streetName,
          streetNumber: 12
        },
        personNumber: 3,
        //owner: '',
        description: faker.lorem.text()
      }
    )
    console.log("APARTMENT", apartment)
  } catch (err) {
    console.log("ERROR", err)
  }


  return response({ user })
}