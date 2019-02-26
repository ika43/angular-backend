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
    let from, to;

    switch (event.httpMethod.toUpperCase()) {
      case 'GET':
        from = new Date('2019-03-05');
        to = new Date('2019-03-11');
        const visits = await Visit.find(
          { from: { $gte: new Date('2019-03-03') } }
        ).countDocuments();
        return response({ visits });
      case 'POST':
        from = new Date('2019-03-05');
        to = new Date('2019-03-11');
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