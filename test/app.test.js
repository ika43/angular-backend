const assert = require('chai').assert;
const { users } = require('../user/userLambda');

// * create events
const userEvent = {
  httpMethod: 'GET',
  path: '/users'
}

const userLoginEvent = {
  httpMethod: 'POST',
  path: '/users/login',
  body: '{"email": "labud9243@gmail.com", "password": "Laba2019"}'
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