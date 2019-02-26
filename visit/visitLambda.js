'use strict';

const { dbConnection } = require('../services/connection.service');
const { response } = require('../handlers/response.handler');
const { decode } = require('../services/jwt.service');
const Visit = require('./visit.model');
const faker = require('faker');

exports.visit = async (event, context) => {

  let user;
  // ! validate request with jwt service
  try {
    user = decode(event.headers.Authorization);
    dbConnection();

    switch (event.httpMethod.toUpperCase()) {
      case 'GET':
        return response('GET');
      case 'POST':
        const from = new Date();
        const to = new Date('2019-03-03');
        const { apartment } = JSON.parse(event.body);
        const visit = await new Visit({
          from,
          to,
          apartment,
          visitors: user._id
        }).save()
        return response({ visit })
      default:
        return response({ 'error': 'Not authorized exception' }, 403);
    }

    //return response({ user })
  } catch (err) {
    return response({ error: err }, 400)
  }
}