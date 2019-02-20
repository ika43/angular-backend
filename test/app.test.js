const assert = require('chai').assert;
const { users } = require('../user/userLambda');
const config = require('../config.json');

// * create events
const userEvent = {
  httpMethod: 'GET',
  path: '/users'
}

const userLoginEvent = {
  httpMethod: 'POST',
  path: '/users/login',
  body: `{"email": "${config.email_login}", "password": "${config.password_login}"}`
}

describe("User Lambda", () => {

  it('GET /users', async () => {

    // call user lambda
    const result = await users(userEvent);
    assert.equal(result.statusCode, 200);
    assert.typeOf(result, 'object');
  });

  it('GET /users/login', async () => {

    // call user lambda
    const result = await users(userLoginEvent);
    console.log("RESULT", result);
    assert.equal(result.statusCode, 200);
    assert.typeOf(result, 'object');
  });

})