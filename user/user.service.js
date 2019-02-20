'use strict';

const User = require('./user.model');
const { validUser } = require('./user.validator');
const { hashPassword, checkPassword } = require('../services/bcrypt.service');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { sendVerificationEmail } = require('../services/email.service');
const config = require('../config.json');

// confirm user with code
const confirm = async (token, code) => {

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded._id })
  if (!user.active) {

    //console.log(`code ${code} === db code ${user.confNumber}`)
    // compare code
    if (+code === user.confNumber) {
      user.active = true;
      user.save();
      const user_jwt = jwt.sign(
        {
          _id: user._id,
          firstname: user.name,
          lastname: user.surname,
          active: user.active
        },
        process.env.JWT_SECRET)
      return { 'status': 'success', 'token': user_jwt };
    } else {
      throw 'Invalid code provided.'
    }
  } else {
    throw 'User already confirmed.'
  }
}

// return all users
const list = async () => {
  return await User.find();
}

// create new user
const create = async (body) => {

  // parse event body to json
  const user = JSON.parse(body);

  // valid user
  const isValid = validUser(user);

  if (isValid.length > 0) { // errors exist
    throw isValid;
  }
  else if (await ifUserExist(user.email)) { // check if user already exist
    throw 'User with this username already exist.';
  } else { // if everything passed create new user

    // generate random number for confirmation code
    const confNumber = Math.floor(100000 + Math.random() * 900000);

    const newUser = await new User(
      {
        name: user.name,
        confNumber,
        surname: user.surname,
        email: user.email,
        country: user.country,
        city: user.city,
        password: await hashPassword(user.password)
      }
    ).save();

    await sendVerificationEmail(user.email, confNumber);
    const user_jwt = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET)
    return user_jwt;
  }
}

const login = async (body) => {

  // get user data from request
  const user = JSON.parse(body);

  if (!validator.isEmail(user.email)) { // valid email address
    throw 'Invalid email address!';
  } else { // find user
    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) throw 'User with this email does not exist.';
    if (!await checkPassword(user.password, dbUser.password)) { // check password
      throw 'Wrong password';
    } else { // sign token to successfully logged user

      //console.log(`dbUSER: ${dbUser} ⤴`)
      if (!dbUser.active) throw 'User is not confirmed.';

      // Fulfill jwt token with user information
      const user_jwt = jwt.sign(
        {
          _id: dbUser._id,
          firstname: dbUser.name,
          lastname: dbUser.surname,
          active: dbUser.active
        },
        process.env.JWT_SECRET || config.JWT_SECRET)
      return user_jwt;
    }
  }
}

// check if user already exist
const ifUserExist = async (email) => {
  return await User.find({ email }).countDocuments() > 0;
}


module.exports = {
  list,
  create,
  login,
  confirm
}