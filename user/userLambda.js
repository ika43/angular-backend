
'use strict';

const { response } = require('../handlers/response.handler');
const { dbConnection } = require('../services/connection.service');
const { list, create, login, confirm } = require('./user.service');
const User = require('./user.model');
const validator = require('validator');

module.exports.users = async (event, context) => {

  // TODO: Validate request
  dbConnection();

  // get method from event
  const method = event.httpMethod.toUpperCase();
  const path = event.path;
  //console.log(`path: 🌴 ${path}`)

  // Create router for incoming request
  switch (method) {
    case 'GET':
      switch (path) {

        case '/users/countries':
          const countries = require('../countries.json');
          return response({ countries: countries.countries.country })

        case '/users':
          const users = await list();
          return response({ users });

        default:
          return response({ message: 'Forbidden' }, 403);
      }

    case 'POST':

      // built in router for login and register
      switch (path) {
        case '/users/register':

          // register new user
          try {
            const user_token = await create(event.body);
            return response({ user_token });
          } catch (error) {
            return response({ error }, 500);
          }
        case '/users/login':

          // login user
          try {
            const resultLogin = await login(event.body);
            return response({ resultLogin });
          } catch (error) {
            return response(error, 500);
          }
        case '/users/email':

          //check if email exist
          const request = JSON.parse(event.body);
          if (!validator.isEmail(request.email)) return response('Invalid email address', 400);
          if (await User.find({ email: request.email }).countDocuments() > 0) {
            console.log(`USAO U true ✅`)
            return response({ exist: true });
          }
          console.log(`USAO U true ❌`)
          return response({ exist: false });

        case '/users/confirm':

          // get token from header
          const token = event.headers.Authorization;

          // get code from request body
          const { code } = JSON.parse(event.body);

          try {

            // confirm user
            const status = await confirm(token, code);
            return response(status);
          } catch (error) {
            return response({ error }, 500);
          }

        default:
          break;
      }
    case 'PUT':
      //users.getAll();
      break;
    case 'DELETE':
      //users.getAll();
      break;
    default:
      break;
  }
};
